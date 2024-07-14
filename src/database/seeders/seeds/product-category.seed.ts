import { ISeeder } from '../seed.interface';
import { ProductCategory } from 'src/modules/product/entities/product-category.entity';

const values: ProductCategory[] = [
  {
    id: 'flu-medications',
    name: 'Flu medications',
  },
  {
    id: 'sexual-health',
    name: 'Sexual Health',
  },
];

export const ProductCategorySeed: ISeeder = {
  table: 'product_category',
  data: values,
};
