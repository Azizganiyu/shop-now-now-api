import { Injectable } from '@nestjs/common';
import { Order } from '../order/entities/order.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { PaymentRequest } from '../payment/entities/payment-request.entity';
import { PaymentStatus } from '../cart/dto/checkout.dto';
import { OrderStatus } from '../order/dto/order.dto';
import { User } from '../user/entities/user.entity';
import { UserRole } from '../user/dto/user.dto';
import { ProductCategory } from '../product/entities/product-category.entity';
import { Product } from '../product/entities/product.entity';
import { RoleTag } from 'src/constants/roletag';

@Injectable()
export class OverviewService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    @InjectRepository(PaymentRequest)
    private readonly paymentRequestRepository: Repository<PaymentRequest>,
    @InjectRepository(ProductCategory)
    private readonly categoryRepository: Repository<ProductCategory>,
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    private dataSource: DataSource,
  ) {}

  async overview() {
    return {
      totalPayments: await this.paymentRequestRepository.sum('amount', {
        status: PaymentStatus.success,
      }),
      orders: {
        total: await this.orderRepository.count(),
        completed: await this.orderRepository.countBy({
          status: OrderStatus.completed,
        }),
      },
      users: {
        total: await this.userRepository.countBy({ roleId: UserRole.user }),
        active: await this.userRepository.countBy({
          status: 'active',
        }),
      },
      staffs: {
        total: await this.userRepository.count({
          where: { role: { tag: RoleTag.admin } },
        }),
        active: await this.userRepository.count({
          where: {
            role: { tag: RoleTag.admin },
            status: 'active',
          },
        }),
      },
      categories: {
        total: await this.categoryRepository.count(),
        active: await this.categoryRepository.countBy({
          status: true,
        }),
      },
      products: {
        total: await this.productRepository.count(),
        active: await this.productRepository.countBy({
          status: true,
        }),
      },
      chart: await this.getChartData(),
      recentOrders: await this.findRecentOrders(),
    };
  }

  async getChartData() {
    const queryRunner = this.dataSource.createQueryRunner();
    const manager = queryRunner.manager;

    const hasOrders = await this.orderRepository.find();
    if (!hasOrders || hasOrders.length == 0) {
      return null;
    }
    const month = [];
    const data = [];
    const query = `
    SELECT \`xdate\`, COUNT(\`order\`.\`id\`)
    FROM (
        SELECT LAST_DAY(CURRENT_DATE) + INTERVAL 1 DAY - INTERVAL 1 MONTH AS \`xdate\` UNION ALL
        SELECT LAST_DAY(CURRENT_DATE) + INTERVAL 1 DAY - INTERVAL 2 MONTH UNION ALL
        SELECT LAST_DAY(CURRENT_DATE) + INTERVAL 1 DAY - INTERVAL 3 MONTH UNION ALL
        SELECT LAST_DAY(CURRENT_DATE) + INTERVAL 1 DAY - INTERVAL 4 MONTH UNION ALL
        SELECT LAST_DAY(CURRENT_DATE) + INTERVAL 1 DAY - INTERVAL 5 MONTH UNION ALL
        SELECT LAST_DAY(CURRENT_DATE) + INTERVAL 1 DAY - INTERVAL 6 MONTH UNION ALL
        SELECT LAST_DAY(CURRENT_DATE) + INTERVAL 1 DAY - INTERVAL 7 MONTH UNION ALL
        SELECT LAST_DAY(CURRENT_DATE) + INTERVAL 1 DAY - INTERVAL 8 MONTH UNION ALL
        SELECT LAST_DAY(CURRENT_DATE) + INTERVAL 1 DAY - INTERVAL 9 MONTH UNION ALL
        SELECT LAST_DAY(CURRENT_DATE) + INTERVAL 1 DAY - INTERVAL 10 MONTH UNION ALL
        SELECT LAST_DAY(CURRENT_DATE) + INTERVAL 1 DAY - INTERVAL 11 MONTH UNION ALL
        SELECT LAST_DAY(CURRENT_DATE) + INTERVAL 1 DAY - INTERVAL 12 MONTH
    ) AS \`dates\`
    LEFT JOIN \`order\` ON \`order\`.\`createdAt\` >= \`xdate\` AND \`order\`.\`createdAt\` < \`xdate\` + INTERVAL 1 MONTH
    GROUP BY \`xdate\`;
    `;
    const result = await manager.query(query);
    console.log(result);
    result.forEach((item) => {
      month.push(
        this.getMonth(new Date(item.xdate).getMonth()) +
          ' ' +
          new Date(item.xdate).getFullYear(),
      );
      data.push(parseFloat(item['COUNT(`order`.`id`)']));
    });
    return { month: month.reverse(), data: data.reverse() };
  }

  getMonth(index) {
    const months = [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec',
    ];
    return months[index];
  }

  async findRecentOrders() {
    return await this.orderRepository
      .createQueryBuilder('order')
      .leftJoinAndSelect('order.items', 'items')
      .leftJoinAndSelect('items.product', 'product')
      .leftJoinAndSelect('product.category', 'category')
      .leftJoinAndSelect('order.shipments', 'shipments')
      .leftJoinAndSelect('shipments.location', 'locationo')
      .leftJoinAndSelect('order.user', 'user')
      .orderBy('order.createdAt', 'DESC')
      .take(5)
      .getMany();
  }
}
