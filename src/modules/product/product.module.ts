import { Module } from '@nestjs/common';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';
import { ProductSubCategoryController } from './product-controllers/product-sub-category.controller';
import { ProductPresentationController } from './product-controllers/product-presentation.controller';
import { ProductPackUnitController } from './product-controllers/product-pack-unit.controller';
import { ProductStrengthUnitController } from './product-controllers/product-strength-unit.controller';
import { ProductManufacturerController } from './product-controllers/product-manufacturer.controller';
import { ProductCategoryController } from './product-controllers/product-category.controller';
import { ProductCategoryService } from './product-services/category.service';
import { ProductSubCategoryService } from './product-services/sub-category.service';
import { ProductPresentationService } from './product-services/presentation.service';
import { ProductPackUnitService } from './product-services/pack-unit.service';
import { ProductStrengthUnitService } from './product-services/strength-unit.service';
import { ProductManufacturerService } from './product-services/manufacturer.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SharedModule } from 'src/shared.module';
import { Product } from './entities/product.entity';
import { ProductCategory } from './entities/product-category.entity';
import { ProductSubCategory } from './entities/product-sub-category.entity';
import { ProductPresentation } from './entities/product-presentation.entity';
import { ProductManufacturer } from './entities/product-manufacturer.entity';
import { ProductStrengthUnit } from './entities/product-strength-unit.entity';
import { ProductPackUnit } from './entities/product-pack-unit.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Product,
      ProductCategory,
      ProductSubCategory,
      ProductPresentation,
      ProductManufacturer,
      ProductStrengthUnit,
      ProductPackUnit,
    ]),
    SharedModule,
  ],
  controllers: [
    ProductController,
    ProductCategoryController,
    ProductSubCategoryController,
    ProductPresentationController,
    ProductPackUnitController,
    ProductStrengthUnitController,
    ProductManufacturerController,
  ],
  providers: [
    ProductService,
    ProductCategoryService,
    ProductSubCategoryService,
    ProductPresentationService,
    ProductPackUnitService,
    ProductStrengthUnitService,
    ProductManufacturerService,
  ],
})
export class ProductModule {}
