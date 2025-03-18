import { ISeeder } from '../seed.interface';
import { ProductCategory } from 'src/modules/product/entities/product-category.entity';

const values: ProductCategory[] = [
  {
    id: 'groceries',
    name: 'Groceries',
    order: 1,
    iconUrl: 'https://api.shopnownow.app/uploads/system/groceries.svg',
  },
  {
    id: 'home-body-care',
    name: 'Home & Body Care',
    order: 2,
    iconUrl: 'https://api.shopnownow.app/uploads/system/home-body-care.svg',
  },
  {
    id: 'alcoholic-drink',
    name: 'Alcoholic Drinks',
    order: 3,
    iconUrl: 'https://api.shopnownow.app/uploads/system/alcoholic-drink.svg',
  },
  {
    id: 'gift-hampers-cakes',
    name: 'Gift Hampers & Cakes',
    order: 4,
    iconUrl: 'https://api.shopnownow.app/uploads/system/gift-hampers-cakes.svg',
  },
  {
    id: 'chopnownow-food',
    name: 'Chopnownow Food',
    order: 5,
    iconUrl: 'https://api.shopnownow.app/uploads/system/chopnownow-food.svg',
  },
  {
    id: 'meat-fish-poultry',
    name: 'Meat, Fish & Poultry',
    order: 6,
    iconUrl: 'https://api.shopnownow.app/uploads/system/meat-fish-poultry.svg',
  },
];

export const ProductCategorySeed: ISeeder = {
  table: 'product_category',
  data: values,
};
