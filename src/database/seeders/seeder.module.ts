import { Logger, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SeederService } from './seeder.service';
import { ormConfig } from 'datasource';

/**
 * Import and provide seeder classes.
 *
 * @module
 */
@Module({
  imports: [TypeOrmModule.forRoot({ ...ormConfig, autoLoadEntities: true })],
  providers: [Logger, SeederService],
})
export class SeederModule {}
