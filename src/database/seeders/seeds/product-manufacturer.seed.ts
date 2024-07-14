import { ProductManufacturer } from 'src/modules/product/entities/product-manufacturer.entity';
import { ISeeder } from '../seed.interface';

const values: ProductManufacturer[] = [
  {
    id: 'sos-essentials',
    name: 'SOS Essentials',
  },
  {
    id: 'october-parma',
    name: 'October Parma',
  },
];

export const ProductManufacturerSeed: ISeeder = {
  table: 'product_manufacturer',
  data: values,
};
