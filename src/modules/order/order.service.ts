import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Order } from './entities/order.entity';
import { Repository } from 'typeorm';
import { HelperService } from 'src/utilities/helper.service';
import { FindShipmentDto } from './dto/find-shipment.dto';
import { PageOptionsDto } from 'src/utilities/pagination/dtos';
import { OrderShipment } from './entities/order-shipment.entity';
import { PageMetaDto } from 'src/utilities/pagination/page-meta.dto';
import { PageDto } from 'src/utilities/pagination/page.dto';
import { FindOrderDto } from './dto/find-order.dto';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    @InjectRepository(OrderShipment)
    private readonly shipmentRepository: Repository<OrderShipment>,
    private helperService: HelperService,
  ) {}

  async findOne(id: string) {
    try {
      return await this.orderRepository.findOneByOrFail({ id });
    } catch (error) {
      throw new NotFoundException('no shipment with specified ID found');
    }
  }

  async findOrders(filter: FindOrderDto, pageOptionsDto: PageOptionsDto) {
    const orders = this.orderRepository
      .createQueryBuilder('order')
      .leftJoinAndSelect('order.items', 'items')
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
      .orderBy('order.createdAt', pageOptionsDto.order);

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
      .orderBy('shipment.createdAt', pageOptionsDto.order);

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
}
