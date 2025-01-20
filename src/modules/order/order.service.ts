import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Order } from './entities/order.entity';
import { Brackets, Repository } from 'typeorm';
import { HelperService } from 'src/utilities/helper.service';
import { FindShipmentDto } from './dto/find-shipment.dto';
import { PageOptionsDto } from 'src/utilities/pagination/dtos';
import { OrderShipment } from './entities/order-shipment.entity';
import { PageMetaDto } from 'src/utilities/pagination/page-meta.dto';
import { PageDto } from 'src/utilities/pagination/page.dto';
import { FindOrderDto } from './dto/find-order.dto';
import { OrderStatus, ShipmentStatus } from './dto/order.dto';
import { NotificationGeneratorService } from '../notification/notification-generator/notification-generator.service';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    @InjectRepository(OrderShipment)
    private readonly shipmentRepository: Repository<OrderShipment>,
    private helperService: HelperService,
    private _ng: NotificationGeneratorService,
  ) {}

  async findOne(id: string) {
    try {
      return await this.orderRepository.findOneOrFail({
        where: [{ id }, { reference: id }],
        relations: [
          'shipments',
          'shipments.location',
          'items',
          'items.product',
        ],
      });
    } catch (error) {
      throw new NotFoundException('no order with specified ID found');
    }
  }

  async findOrders(filter: FindOrderDto, pageOptionsDto: PageOptionsDto) {
    const orders = this.orderRepository
      .createQueryBuilder('order')
      .leftJoinAndSelect('order.items', 'items')
      .leftJoinAndSelect('items.product', 'product')
      .leftJoinAndSelect('product.category', 'category')
      .leftJoinAndSelect('order.shipments', 'shipments')
      .leftJoinAndSelect('shipments.location', 'locationo')
      .leftJoinAndSelect('order.user', 'user')
      .andWhere(filter.userId ? `order.userId = :userId` : '1=1', {
        userId: filter.userId,
      })
      .andWhere(filter.status ? `order.status = :status` : '1=1', {
        status: filter.status,
      })
      .andWhere(filter.from ? `order.createdAt >= :fromDate` : '1=1', {
        fromDate: filter.from,
      })
      .andWhere(filter.to ? `order.createdAt <= :toDate` : '1=1', {
        toDate: filter.to,
      })
      .andWhere(
        filter.search
          ? new Brackets((qb) => {
              qb.where('user.firstName like :firstName', {
                firstName: '%' + filter.search + '%',
              })
                .orWhere('user.lastName like :lastName', {
                  lastName: '%' + filter.search + '%',
                })
                .orWhere('user.email like :email', {
                  email: '%' + filter.search + '%',
                });
            })
          : '1=1',
      )
      .orderBy('order.createdAt', pageOptionsDto.order)
      .skip(pageOptionsDto.skip)
      .take(pageOptionsDto.take);

    const itemCount = await orders.getCount();
    const { entities } = await orders.getRawAndEntities();
    const pageMetaDto = new PageMetaDto({ itemCount, pageOptionsDto });
    return new PageDto(entities, pageMetaDto);
  }

  async findShipment(filter: FindShipmentDto, pageOptionsDto: PageOptionsDto) {
    const shipments = this.shipmentRepository
      .createQueryBuilder('shipment')
      .leftJoinAndSelect('shipment.order', 'order')
      .leftJoinAndSelect('shipment.address', 'address')
      .leftJoinAndSelect('order.user', 'user')
      .andWhere(filter.userId ? `order.userId = :userId` : '1=1', {
        userId: filter.userId,
      })
      .andWhere(filter.orderId ? `shipment.orderId = :orderId` : '1=1', {
        orderId: filter.orderId,
      })
      .andWhere(filter.status ? `shipment.status = :status` : '1=1', {
        status: filter.status,
      })
      .andWhere(filter.from ? `shipment.createdAt >= :fromDate` : '1=1', {
        fromDate: filter.from,
      })
      .andWhere(filter.to ? `shipment.createdAt <= :toDate` : '1=1', {
        toDate: filter.to,
      })
      .orderBy('shipment.createdAt', pageOptionsDto.order)
      .skip(pageOptionsDto.skip)
      .take(pageOptionsDto.take);

    const itemCount = await shipments.getCount();
    const { entities } = await shipments.getRawAndEntities();
    const pageMetaDto = new PageMetaDto({ itemCount, pageOptionsDto });
    return new PageDto(entities, pageMetaDto);
  }

  async userHasOrdered(userId: string, productId: string) {
    const count = await this.orderRepository
      .createQueryBuilder('order')
      .leftJoinAndSelect('order.items', 'orderItem')
      .where('order.userId = :userId', { userId })
      .andWhere('orderItem.productId = :productId', { productId })
      .getCount();

    if (count > 0) {
      return true;
    }
    return false;
  }

  async changeStatus(orderId: string, status: ShipmentStatus) {
    switch (status) {
      case ShipmentStatus.pending: {
        await this.orderRepository.update(orderId, {
          status: OrderStatus.pending,
        });
        await this.shipmentRepository.update(
          { orderId },
          { status: ShipmentStatus.pending },
        );
        break;
      }
      case ShipmentStatus.processing: {
        await this.orderRepository.update(orderId, {
          status: OrderStatus.pending,
        });
        await this.shipmentRepository.update(
          { orderId },
          { status: ShipmentStatus.processing },
        );
        break;
      }
      case ShipmentStatus.in_transit: {
        await this.orderRepository.update(orderId, {
          status: OrderStatus.pending,
        });
        await this.shipmentRepository.update(
          { orderId },
          { status: ShipmentStatus.in_transit },
        );
        break;
      }
      case ShipmentStatus.delivered: {
        await this.orderRepository.update(orderId, {
          status: OrderStatus.completed,
        });
        await this.shipmentRepository.update(
          { orderId },
          { status: ShipmentStatus.delivered },
        );
        //send mail
        break;
      }
      case ShipmentStatus.canceled: {
        await this.orderRepository.update(orderId, {
          status: OrderStatus.canceled,
        });
        await this.shipmentRepository.update(
          { orderId },
          { status: ShipmentStatus.canceled },
        );
        //send mail
        break;
      }
      default:
        throw new BadRequestException('invalid status');
    }
    const order = await this.findOne(orderId);
    await this._ng.sendOrderUpdate(order);
  }
}
