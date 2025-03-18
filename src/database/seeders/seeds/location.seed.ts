import { ISeeder } from '../seed.interface';
import { Location } from 'src/modules/location/entities/location.entity';

const values: Location[] = [];

export const LocationSeed: ISeeder = {
  table: 'location',
  data: values,
};
