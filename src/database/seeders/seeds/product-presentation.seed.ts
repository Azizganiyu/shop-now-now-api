import { ProductPresentation } from 'src/modules/product/entities/product-presentation.entity';
import { ISeeder } from '../seed.interface';

const values: ProductPresentation[] = [
  {
    id: 'syrup',
    name: 'Syrup',
  },
  {
    id: 'capsule',
    name: 'Capsule',
  },
];

export const ProductPresentationSeed: ISeeder = {
  table: 'product_presentation',
  data: values,
};
