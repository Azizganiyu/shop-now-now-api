import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm';
import { EntityManager, IsNull, Not, Repository } from 'typeorm';
import { CreateCart, UpdateCart } from './dto/cart-create.dto';
import { Cart } from './entities/cart.entity';
import { CartCheckout, PaymentEntity, PaymentType } from './dto/checkout.dto';
import { Order } from '../order/entities/order.entity';
import { OrderItem } from '../order/entities/order-item.entity';
import { ActivityService } from '../activity/activity.service';
import { OrderShipment } from '../order/entities/order-shipment.entity';
import { HelperService } from 'src/utilities/helper.service';
import { Address } from '../address/entities/address.entity';
import { PaymentService } from '../payment/payment.service';
import { User } from '../user/entities/user.entity';
import { PaymentProviders } from '../payment/dto/payment-initialize.dto';
import { TransactionPurpose } from '../transaction/dto/transaction.dto';
import { ShipmentStatus } from '../order/dto/order.dto';
import { TransactionService } from '../transaction/transaction.service';
import { Wish } from './entities/wish.entity';
import { WishItem } from './entities/wish-item.entity';
import { Product } from '../product/entities/product.entity';
import { OrderService } from '../order/order.service';
import { FeeType } from '../product/dto/product-create.dto';
import { ProductBand } from '../product/entities/product-band.entity';
import { AppConfigService } from '../app-config/app-config.service';
import { Location } from '../location/entities/location.entity';
import { CouponService } from '../coupon/coupon.service';

@Injectable()
export class CartService {
  constructor(
    @InjectRepository(Wish)
    private readonly wishRepository: Repository<Wish>,
    @InjectRepository(WishItem)
    private readonly wishItemRepository: Repository<WishItem>,
    @InjectRepository(Cart)
    private readonly cartRepository: Repository<Cart>,
    @InjectRepository(Address)
    private readonly addressRepository: Repository<Address>,
    @InjectEntityManager() private readonly entityManager: EntityManager,
    @InjectRepository(Location)
    private locationRepository: Repository<Location>,
    private activityService: ActivityService,
    private helperService: HelperService,
    private paymenService: PaymentService,
    private transactionService: TransactionService,
    private orderService: OrderService,
    private appConfigService: AppConfigService,
    private couponService: CouponService,
  ) {}

  async findAll(userId: string) {
    return await this.cartRepository.findBy({ userId });
  }

  async findOne(id: string) {
    try {
      return await this.cartRepository.findOneByOrFail({
        id,
      });
    } catch (error) {
      throw new NotFoundException('Cart not found');
    }
  }

  async create(cart: CreateCart, userId: string) {
    const exist = await this.cartRepository.findOneBy({
      productId: cart.productId,
      userId,
    });
    if (exist) {
      await this.cartRepository.update(exist.id, {
        quantity: exist.quantity + cart.quantity,
      });
      return await this.findOne(exist.id);
    }
    const create = await this.cartRepository.create({
      userId,
      ...cart,
    });
    return await this.cartRepository.save(create);
  }

  async checkout(checkout: CartCheckout, user: User) {
    const checkoutSetting = await this.checkoutSettings(user);
    const address = await this.addressRepository.findOneBy({
      userId: user.id,
    });

    if (checkoutSetting.carts.length === 0) {
      throw new BadRequestException('no item found in cart');
    }

    let couponDiscount: number = 0;
    if (checkout.couponCode && checkoutSetting.discount.discount === 0) {
      const coupon = await this.couponService.findCoupon(checkout.couponCode);
      if (coupon && coupon.value > 0) {
        couponDiscount = this.calculateFee(checkoutSetting.amountToPay, {
          value: coupon.value,
          type: coupon.valueType as FeeType,
        });
      }
      checkoutSetting.discount.discount = couponDiscount;
      checkoutSetting.discount.discountValueType = coupon.valueType as FeeType;
      checkoutSetting.discount.discountValue = coupon.value;
      checkoutSetting.discount.discountType = 'COUPON';
    }

    const amountToPay = checkoutSetting.amountToPay - couponDiscount;

    return await this.entityManager.transaction(
      async (transactionalEntityManager) => {
        const reference = await this.getReference(transactionalEntityManager);
        const createOrder = transactionalEntityManager.create(Order, {
          userId: user.id,
          reference,
          paymentType: checkout.paymentType,
        });
        let order = await transactionalEntityManager.save(Order, createOrder);
        for (const item of checkoutSetting.carts) {
          const createItem = transactionalEntityManager.create(OrderItem, {
            productId: item.productId,
            orderId: order.id,
            quantity: item.quantity,
          });
          await transactionalEntityManager.save(OrderItem, createItem);
        }
        const createShipment = transactionalEntityManager.create(
          OrderShipment,
          {
            firstName: address.firstName,
            lastName: address.lastName,
            email: address.email,
            phone: address.phone,
            address: address.address,
            lgaId: address.lgaId,
            amount: checkoutSetting.subTotal,
            amountToPay,
            fees: checkoutSetting.fees,
            discount: checkoutSetting.discount.discount,
            discountType: checkoutSetting.discount.discountType,
            discountValue: checkoutSetting.discount.discountValue,
            discountValueType: checkoutSetting.discount.discountValueType,
            couponCode: checkout.couponCode,
            deliveryFee: checkoutSetting.deliveryPrice,
            pointToCredit: checkoutSetting.pointToCredit,
            orderId: order.id,
            reference: 'INV' + this.helperService.generateRandomAlphaNum(8),
            expectedDeliveryDate: checkout.expectedDeliveryDate,
            additionalInfo: checkout.additionalInfo,
          },
        );

        const shipment = await transactionalEntityManager.save(
          OrderShipment,
          createShipment,
        );

        let payment = null;
        if (checkout.paymentType === PaymentType.CARD) {
          payment = await this.paymenService.initialize(
            {
              amount: amountToPay,
              paymentProvider: PaymentProviders.MONNIFY,
              entity: PaymentEntity.SHIPMENT,
              entityReference: shipment.reference,
            },
            user,
          );
        } else if (checkout.paymentType === PaymentType.WALLET) {
          console.log('charge wallet');
          const transaction = await this.transactionService.chargeWallet({
            userId: user.id,
            amount: amountToPay,
            purpose: TransactionPurpose.order,
            reference: shipment.reference,
            paymentProvider: PaymentProviders.SNN,
          });
          console.log('finished charging wallet');
          await transactionalEntityManager.update(OrderShipment, shipment.id, {
            amountPaid: amountToPay,
            paymentRef: transaction.reference,
            paid: true,
            status: ShipmentStatus.processing,
          });
          console.log('finished charging wallet 2');
          for (const item of checkoutSetting.carts) {
            const product = await transactionalEntityManager.findOneBy(
              Product,
              {
                id: item.productId,
              },
            );
            const newStock = product.stock - item.quantity;

            console.log('finished charging wallet 3');
            await transactionalEntityManager.update(Product, product.id, {
              stock: newStock < 0 ? 0 : newStock,
            });

            console.log('finished charging wallet 4');
          }
          this.orderService.changeStatus(order.id, ShipmentStatus.processing);
        }

        await this.deleteCart(user.id);

        order = await transactionalEntityManager.findOne(Order, {
          where: { id: order.id },
        });

        return {
          order,
          payment: payment,
        };
      },
    );
  }

  async checkoutSettings(user: User) {
    const config = await this.appConfigService.getConfig();

    const address = await this.addressRepository.findOneBy({
      userId: user.id,
    });
    const carts = await this.cartRepository.find({
      where: { userId: user.id },
      relations: ['product', 'product.category', 'product.category.band'],
    });

    const subTotal = carts.reduce((sum, cart) => {
      return sum + cart.product.sellingPrice * cart.quantity;
    }, 0);

    const checkoutBands: ProductBand[] = [];
    for (const cart of carts) {
      const band = cart.product.category.band;
      if (band && !checkoutBands.includes(band)) {
        checkoutBands.push(band);
      }
    }

    const fees = {};
    let deliveryPrice = 0;
    let minimumOrderAmount = 0;

    for (const band of checkoutBands) {
      if (band.fees && band.fees?.length > 0) {
        for (const fee of band.fees) {
          const feeName = fee.name?.toLowerCase();
          fees[feeName] =
            (fees[feeName] ?? 0) + this.calculateFee(subTotal, fee);
        }
      }

      if (address && address.lgaId) {
        const location = await this.locationRepository.findOneBy({
          bandId: band.id,
          lgaId: address.lgaId,
        });
        const dprice = location
          ? location.deliveryPrice
          : config.defaultDeliveryPrice;
        if (dprice > deliveryPrice) {
          deliveryPrice = dprice;
        }
      }

      if (band.minimumOrderAmount > minimumOrderAmount) {
        minimumOrderAmount = band.minimumOrderAmount;
      }
    }

    let discountType = 'NONE';
    let discountValue = 0;
    let discountValueType = FeeType.FLAT;
    let discount = 0;

    if (config.discountStatus && subTotal >= config.discountThreshold) {
      discountType = 'AUTO DISCOUNT';
      discountValue = config.discountValue;
      discountValueType = config.discountValueType as FeeType;
      discount = this.calculateFee(subTotal, {
        type: discountValueType,
        value: discountValue,
      });
    }

    let pointToCredit = 0;
    if (config?.pointStatus && subTotal >= config?.pointThreshold) {
      pointToCredit = Math.floor(subTotal / config?.pointThreshold);
    }

    const totalFees: number = Object.values(fees).reduce(
      (sum: number, value: number) => sum + value,
      0,
    ) as number;

    return {
      subTotal,
      fees,
      discount: {
        discountType,
        discountValueType,
        discountValue,
        discount,
      },
      deliveryPrice,
      amountToPay: subTotal + (totalFees ?? 0) + deliveryPrice - discount,
      checkoutBands,
      minimumOrderAmount,
      pointToCredit,
      carts,
    };
  }

  calculateFee(amount, data: { value: number; type: FeeType }) {
    if (!data.value) {
      return 0;
    }
    if (data.type === FeeType.FLAT) {
      return data.value;
    }
    return (data.value / 100) * amount;
  }

  async saveWishList(user: User) {
    const carts = await this.cartRepository.find({
      where: { userId: user.id },
      relations: ['product'],
    });
    if (carts.length === 0) {
      throw new BadRequestException('no item found in cart');
    }

    try {
      return await this.entityManager.transaction(
        async (transactionalEntityManager) => {
          const reference =
            'WSH-' + this.helperService.generateRandomAlphaNum(22);
          const createWish = transactionalEntityManager.create(Wish, {
            userId: user.id,
            reference,
          });
          const wish = await transactionalEntityManager.save(Wish, createWish);
          for (const item of carts) {
            const createItem = transactionalEntityManager.create(WishItem, {
              productId: item.productId,
              wishId: wish.id,
              quantity: item.quantity,
            });
            await transactionalEntityManager.save(WishItem, createItem);
          }
          await this.deleteCart(user.id);
          return wish;
        },
      );
    } catch (error) {
      await this.activityService.log(error, 'Wish CREATE');
      throw new InternalServerErrorException('unable to save list');
    }
  }

  async getWishList(user: User) {
    return await this.wishRepository.find({
      where: { userId: user.id },
      relations: ['items'],
    });
  }

  async getReference(manager: EntityManager) {
    const abbr = 'SNN';

    const lastOrder = await manager.findOne(Order, {
      where: { id: Not(IsNull()) },
      order: { createdAt: 'DESC' },
    });

    let newCount = '';
    if (lastOrder) {
      const lastCount = Number(lastOrder.reference.split(abbr)[1]);
      newCount = `${abbr}${(lastCount + 1).toString().padStart(6, '0')}`;
    } else {
      newCount = `${abbr}${(1).toString().padStart(6, '0')}`;
    }

    const exist = await manager.findOne(Order, {
      where: { reference: newCount },
    });

    if (exist) {
      throw new BadRequestException('unable to set reference for order');
    } else {
      return newCount;
    }
  }

  async update(id: string, cart: UpdateCart) {
    await this.cartRepository.update(id, { ...cart });
    return await this.findOne(id);
  }

  async remove(id: string) {
    return await this.cartRepository.delete(id);
  }

  async deleteCart(userId: string) {
    return await this.cartRepository.delete({ userId });
  }

  async deleteWishList(id: string) {
    await this.wishItemRepository.delete({ wishId: id });
    return await this.wishRepository.delete(id);
  }
}
