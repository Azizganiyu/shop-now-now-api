import { ProductSubCategory } from 'src/modules/product/entities/product-sub-category.entity';
import { ISeeder } from '../seed.interface';

const values: ProductSubCategory[] = [
  // {
  //   id: 'fertility',
  //   name: 'Fertility',
  //   categoryId: 'sexual-health',
  // },
  // {
  //   id: 'cough-cold',
  //   name: 'Cough & Cold',
  //   categoryId: 'flu-medications',
  // },
];

export const ProductSubCategorySeed: ISeeder = {
  table: 'product_sub_category',
  data: values,
};
