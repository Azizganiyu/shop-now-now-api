import { Injectable, Logger } from '@nestjs/common';
import { RoleSeed } from './seeds/role.seed';
import { AdminSeed } from './seeds/admin.seed';
import { DataSource } from 'typeorm';
import { ProductCategorySeed } from './seeds/product-category.seed';
import { ProductSeed } from './seeds/product.seed';
import { FaqSeed } from './seeds/faq.seed';
import { QuickGuideSeed } from './seeds/quick-guide.seed';
import { LocationSeed } from './seeds/location.seed';
import { ConfigSeed } from './seeds/config.seed';

@Injectable()
export class SeederService {
  private seeds = [RoleSeed, AdminSeed, ProductSeed];
  // private seeds = [
  //   RoleSeed,
  //   AdminSeed,
  //   ProductCategorySeed,
  //   ProductSeed,
  //   FaqSeed,
  //   QuickGuideSeed,
  //   LocationSeed,
  //   ConfigSeed,
  // ];

  constructor(
    private readonly logger: Logger,
    private readonly dataSource: DataSource,
  ) {}

  /**
   * Seed the database with predefined data.
   *
   * This method uses a query runner to connect to the database,
   * then iterates through predefined seed data and upserts it into
   * the respective tables. It logs each table that has been seeded.
   */
  async seed() {
    const queryRunner = await this.dataSource.createQueryRunner();
    await queryRunner.connect();
    const manager = queryRunner.manager;

    await Promise.all(
      this.seeds.map(async (item) => {
        await manager.upsert(item.table, item.data, ['id']);
        this.logger.debug(`${item.table} seeded`);
      }),
    );
  }
}
