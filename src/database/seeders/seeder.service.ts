import { Injectable, Logger } from '@nestjs/common';
import { RoleSeed } from './seeds/role.seed';
import { AdminSeed } from './seeds/admin.seed';
import { DataSource } from 'typeorm';
import { ProductCategorySeed } from './seeds/product-category.seed';
import { ProductSubCategorySeed } from './seeds/product-sub-category.seed';
import { ProductManufacturerSeed } from './seeds/product-manufacturer.seed';
import { ProductPresentationSeed } from './seeds/product-presentation.seed';
import { ProductPackUnitSeed } from './seeds/product-pack-unit.seed';
import { ProductStrengthUnitSeed } from './seeds/product-strength-unit.seed';

@Injectable()
export class SeederService {
  private seeds = [RoleSeed, AdminSeed];
  // private seeds = [
  //   RoleSeed,
  //   AdminSeed,
  //   ProductCategorySeed,
  //   ProductSubCategorySeed,
  //   ProductManufacturerSeed,
  //   ProductPresentationSeed,
  //   ProductPackUnitSeed,
  //   ProductStrengthUnitSeed,
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
