import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import {
  CreateProductSubCategory,
  UpdateProductSubCategory,
} from '../dto/product-create.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Not, Repository } from 'typeorm';
import { ProductSubCategory } from '../entities/product-sub-category.entity';
import { Product } from '../entities/product.entity';
import { RequestContextService } from 'src/utilities/request-context.service';
import { RoleTag } from 'src/constants/roletag';
import { HelperService } from 'src/utilities/helper.service';
import { ProductCategory } from '../entities/product-category.entity';

@Injectable()
export class ProductSubCategoryService {
  constructor(
    @InjectRepository(ProductSubCategory)
    private readonly subCategoryRepository: Repository<ProductSubCategory>,
    @InjectRepository(ProductCategory)
    private readonly categoryRepository: Repository<ProductCategory>,
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    private requestContext: RequestContextService,
    private helperService: HelperService,
  ) {}

  /**
   * Find all sub-categories based on user role and optional category ID filter.
   *
   * If the user role is admin, find all sub-categories optionally filtered by category ID.
   * Otherwise, find only active sub-categories optionally filtered by category ID.
   *
   * @param categoryId - Optional category ID to filter sub-categories.
   * @returns List of sub-categories based on user role and optional category ID filter.
   */
  async findAll(categoryId: string = null) {
    return this.requestContext.roleTag === RoleTag.admin
      ? await this.subCategoryRepository.findBy({
          categoryId: categoryId ?? Not(IsNull()),
        })
      : await this.subCategoryRepository.findBy({
          categoryId: categoryId ?? Not(IsNull()),
          status: true,
        });
  }

  /**
   * Find a sub-category by its ID.
   *
   * @param id - ID of the sub-category to find.
   * @returns Found sub-category object, or null if not found.
   */
  async findOne(id: string) {
    return await this.subCategoryRepository.findOne({ where: { id } });
  }

  /**
   * Create a new sub-category.
   *
   * @param subCategory - Sub-category data to create.
   * @returns Created sub-category object.
   * @throws BadRequestException if the sub-category name is already taken.
   */
  async create(subCategory: CreateProductSubCategory) {
    const category = await this.categoryRepository.findOneBy({
      id: subCategory.categoryId,
    });
    if (!category) {
      throw new NotFoundException('invalid category');
    }
    const id = this.helperService.idFromName(subCategory.name);
    await this.checkTaken(id);
    const create = await this.subCategoryRepository.create({
      id,
      ...subCategory,
    });
    return await this.subCategoryRepository.save(create);
  }

  /**
   * Check if a sub-category name is already taken.
   *
   * @param id - ID derived from the sub-category name.
   * @throws BadRequestException if the name is already taken.
   */
  async checkTaken(id: string) {
    const exist = await this.findOne(id);
    if (exist) {
      throw new BadRequestException('Name is already taken');
    }
  }

  /**
   * Update a sub-category by its ID.
   *
   * @param id - ID of the sub-category to update.
   * @param subCategory - Updated sub-category data.
   * @returns Updated sub-category object.
   */
  async update(id: string, subCategory: UpdateProductSubCategory) {
    const category = await this.categoryRepository.findOneBy({
      id: subCategory.categoryId,
    });
    if (!category) {
      throw new NotFoundException('invalid category');
    }
    await this.subCategoryRepository.update(id, subCategory);
    return await this.findOne(id);
  }

  /**
   * Activate (enable) a sub-category by its ID.
   *
   * @param id - ID of the sub-category to activate.
   * @returns Activated sub-category object.
   */
  async activate(id: string) {
    return await this.subCategoryRepository.update(id, { status: true });
  }

  /**
   * Deactivate (disable) a sub-category by its ID.
   *
   * @param id - ID of the sub-category to deactivate.
   * @returns Deactivated sub-category object.
   */
  async deactivate(id: string) {
    return await this.subCategoryRepository.update(id, { status: false });
  }

  /**
   * Remove a sub-category by its ID.
   *
   * Checks if the sub-category has associated products before deletion.
   *
   * @param id - ID of the sub-category to remove.
   * @returns Deleted sub-category object.
   * @throws ForbiddenException if the sub-category has associated products.
   */
  async remove(id: string) {
    const hasProduct = await this.productRepository.findOne({
      where: { subCategoryId: id },
    });
    if (hasProduct) {
      throw new ForbiddenException('Sub-category has products attached');
    }

    return await this.subCategoryRepository.delete(id);
  }
}
