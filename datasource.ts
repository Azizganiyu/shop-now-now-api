import * as dotenv from 'dotenv';
import { DataSource, DataSourceOptions } from 'typeorm';
import { MysqlConnectionOptions } from 'typeorm/driver/mysql/MysqlConnectionOptions';
dotenv.config();

const config: DataSourceOptions | MysqlConnectionOptions = {
  migrationsTableName: 'migrations',
  type: 'mysql',
  logging: false,
  synchronize: false,
  name: 'default',
  username: process.env.DB_USER,
  password: Number(process.env.DB_USE_PASS) ? String(process.env.DB_PASS) : '',
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  ssl: {
    rejectUnauthorized: false,
  },
  database: process.env.DB_NAME,
  entities: ['dist/src/modules/**/entities/*.entity.js'],
  migrations: ['dist/src/database/migrations/*.js'],
};

export const connectionSource = new DataSource(config);
export const ormConfig: MysqlConnectionOptions = config;
