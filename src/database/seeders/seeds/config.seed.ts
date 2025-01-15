import { AppConfig } from 'src/modules/app-config/entities/app-config.entity';
import { ISeeder } from '../seed.interface';

const values: AppConfig[] = [
  {
    id: '5ec86e5a-9c66-455b-982b-9f8bf261cdfe',
  },
];

export const ConfigSeed: ISeeder = {
  table: 'app_config',
  data: values,
};
