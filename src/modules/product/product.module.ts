import { Module } from '@nestjs/common';
import { ProductController } from './product-controllers/product.controller';
import { ProductService } from './product-services/product.service';
import { ProductCategoryController } from './product-controllers/product-category.controller';
import { ProductCategoryService } from './product-services/category.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SharedModule } from 'src/shared.module';
import { Product } from './entities/product.entity';
import { ProductCategory } from './entities/product-category.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Product, ProductCategory]), SharedModule],
  controllers: [ProductController, ProductCategoryController],
  providers: [ProductService, ProductCategoryService],
})
export class ProductModule {}
