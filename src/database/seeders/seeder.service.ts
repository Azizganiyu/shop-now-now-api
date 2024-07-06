import { Injectable, Logger } from '@nestjs/common';
import { RoleSeed } from './seeds/role.seed';
import { AdminSeed } from './seeds/admin.seed';
import { DataSource } from 'typeorm';

@Injectable()
export class SeederService {
  private seeds = [RoleSeed, AdminSeed];

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
