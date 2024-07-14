import { ProductPackUnit } from 'src/modules/product/entities/product-pack-unit.entity';
import { ISeeder } from '../seed.interface';

const values: ProductPackUnit[] = [
  {
    id: 'ml',
    name: 'ml',
  },
  {
    id: 'caps',
    name: 'caps',
  },
];

export const ProductPackUnitSeed: ISeeder = {
  table: 'product_pack_unit',
  data: values,
};
