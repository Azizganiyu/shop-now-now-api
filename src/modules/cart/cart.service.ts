import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import { CreateCart, UpdateCart } from './dto/cart-create.dto';
import { Cart } from './entities/cart.entity';
import { CartCheckout } from './dto/checkout.dto';
import { Order } from '../order/entities/order.entity';
import { OrderItem } from '../order/entities/order-item.entity';
import { ActivityService } from '../activity/activity.service';
import { OrderShipment } from '../order/entities/order-shipment.entity';
import { HelperService } from 'src/utilities/helper.service';
import { DeliveryGeneralEstimate } from './delivery-estimates';

@Injectable()
export class CartService {
  constructor(
    @InjectRepository(Cart)
    private readonly cartRepository: Repository<Cart>,
    @InjectEntityManager() private readonly entityManager: EntityManager,
    private activityService: ActivityService,
    private helperService: HelperService,
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

  async checkout(checkout: CartCheckout, userId: string) {
    const carts = await this.cartRepository.findBy({ userId });
    if (carts.length === 0) {
      throw new BadRequestException('no item found in cart');
    }
    try {
      return await this.entityManager.transaction(
        async (transactionalEntityManager) => {
          const createOrder = transactionalEntityManager.create(Order, {
            userId,
            type: checkout.orderType,
            duration: checkout.duration,
            durationType: checkout.durationType,
            nextShipmentDate: new Date(),
          });
          const order = await transactionalEntityManager.save(
            Order,
            createOrder,
          );
          for (const item of carts) {
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
              orderId: order.id,
              adressId: checkout.addressId,
              orderRef: 'INV' + this.helperService.generateRandomAlphaNum(8),
              duration: DeliveryGeneralEstimate.duration,
              expectedDeliveryDate: this.helperService.setDateFuture(
                DeliveryGeneralEstimate.duration * 86400,
              ),
            },
          );
          await transactionalEntityManager.save(OrderShipment, createShipment);

          //use the paymentRef to create initial transaction

          return await transactionalEntityManager.findOne(Order, {
            where: { id: order.id },
          });
        },
      );
    } catch (error) {
      await this.activityService.log(error, 'ORDER CREATE');
      throw new InternalServerErrorException('unable to complete order');
    }
  }

  async update(id: string, cart: UpdateCart) {
    await this.cartRepository.update(id, { ...cart });
    return await this.findOne(id);
  }

  async remove(id: string) {
    return await this.cartRepository.delete(id);
  }
}
