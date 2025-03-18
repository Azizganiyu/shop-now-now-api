import { Module } from '@nestjs/common';
import { ProductController } from './product-controllers/product.controller';
import { ProductService } from './product-services/product.service';
import { ProductCategoryController } from './product-controllers/product-category.controller';
import { ProductCategoryService } from './product-services/category.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SharedModule } from 'src/shared.module';
import { Product } from './entities/product.entity';
import { ProductCategory } from './entities/product-category.entity';
import { ProductBandController } from './product-controllers/product-band.controller';
import { ProductBandService } from './product-services/band.service';
import { ProductBand } from './entities/product-band.entity';
import { AppConfigModule } from '../app-config/app-config.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Product, ProductCategory, ProductBand]),
    SharedModule,
    AppConfigModule,
  ],
  controllers: [
    ProductController,
    ProductCategoryController,
    ProductBandController,
  ],
  providers: [ProductService, ProductCategoryService, ProductBandService],
})
export class ProductModule {}
