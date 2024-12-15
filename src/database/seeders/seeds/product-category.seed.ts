import { ISeeder } from '../seed.interface';
import { ProductCategory } from 'src/modules/product/entities/product-category.entity';

const values: ProductCategory[] = [
  {
    id: 'groceries',
    name: 'Groceries',
    iconUrl: 'http://localhost:3000/uploads/system/groceries.svg',
  },
  {
    id: 'home-body-care',
    name: 'Home & Body Care',
    iconUrl: 'http://localhost:3000/uploads/system/home-body-care.svg',
  },
  {
    id: 'alcoholic-drink',
    name: 'Alcoholic Drinks',
    iconUrl: 'http://localhost:3000/uploads/system/alcoholic-drink.svg',
  },
  {
    id: 'gift-hampers-cakes',
    name: 'Gift Hampers & Cakes',
    iconUrl: 'http://localhost:3000/uploads/system/gift-hampers-cakes.svg',
  },
  {
    id: 'chopnownow-food',
    name: 'Chopnownow Food',
    iconUrl: 'http://localhost:3000/uploads/system/chopnownow-food.svg',
  },
  {
    id: 'meat-fish-poultry',
    name: 'Meat, Fish & Poultry',
    iconUrl: 'http://localhost:3000/uploads/system/meat-fish-poultry.svg',
  },
];

export const ProductCategorySeed: ISeeder = {
  table: 'product_category',
  data: values,
};
