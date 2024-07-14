import { ProductStrengthUnit } from 'src/modules/product/entities/product-strength-unit.entity';
import { ISeeder } from '../seed.interface';

const values: ProductStrengthUnit[] = [
  {
    id: 'mg',
    name: 'mg',
  },
  {
    id: 'g',
    name: 'g',
  },
];

export const ProductStrengthUnitSeed: ISeeder = {
  table: 'product_strength_unit',
  data: values,
};
