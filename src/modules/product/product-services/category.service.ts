import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProductCategory } from '../entities/product-category.entity';
import { Product } from '../entities/product.entity';
import { ProductSubCategory } from '../entities/product-sub-category.entity';
import {
  CreateProductCategory,
  UpdateProductCategory,
} from '../dto/product-create.dto';
import { RequestContextService } from 'src/utilities/request-context.service';
import { RoleTag } from 'src/constants/roletag';
import { HelperService } from 'src/utilities/helper.service';

@Injectable()
export class ProductCategoryService {
  constructor(
    @InjectRepository(ProductCategory)
    private readonly categoryRepository: Repository<ProductCategory>,
    @InjectRepository(ProductSubCategory)
    private readonly subCategoryRepository: Repository<ProductSubCategory>,
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    private requestContext: RequestContextService,
    private helperService: HelperService,
  ) {}

  /**
   * Retrieve all categories based on user role.
   *
   * If the user role is admin, retrieve all categories.
   * Otherwise, retrieve only active categories.
   *
   * @returns List of categories based on user role.
   */
  async findAll() {
    return this.requestContext.roleTag === RoleTag.admin
      ? await this.categoryRepository.find()
      : await this.categoryRepository.findBy({ status: true });
  }

  /**
   * Find a category by its ID.
   *
   * @param id - ID of the category to find.
   * @returns Found category object, or null if not found.
   */
  async findOne(id: string) {
    return await this.categoryRepository.findOne({ where: { id } });
  }

  /**
   * Create a new category.
   *
   * @param category - Category data to create.
   * @returns Created category object.
   * @throws BadRequestException if the category name is already taken.
   */
  async create(category: CreateProductCategory) {
    const id = this.helperService.idFromName(category.name);
    await this.checkTaken(id);
    const create = await this.categoryRepository.create({ id, ...category });
    return await this.categoryRepository.save(create);
  }

  /**
   * Check if a category name is already taken.
   *
   * @param id - ID derived from the category name.
   * @throws BadRequestException if the name is already taken.
   */
  async checkTaken(id: string) {
    const exist = await this.findOne(id);
    if (exist) {
      throw new BadRequestException('Name is already taken');
    }
  }

  /**
   * Update a category by its ID.
   *
   * @param id - ID of the category to update.
   * @param category - Updated category data.
   * @returns Updated category object.
   */
  async update(id: string, category: UpdateProductCategory) {
    await this.categoryRepository.update(id, category);
    return await this.findOne(id);
  }

  /**
   * Activate (enable) a category by its ID.
   *
   * @param id - ID of the category to activate.
   * @returns Activated category object.
   */
  async activate(id: string) {
    return await this.categoryRepository.update(id, { status: true });
  }

  /**
   * Deactivate (disable) a category by its ID.
   *
   * @param id - ID of the category to deactivate.
   * @returns Deactivated category object.
   */
  async deactivate(id: string) {
    return await this.categoryRepository.update(id, { status: false });
  }

  /**
   * Remove a category by its ID.
   *
   * Checks if the category has associated products or sub-categories
   * before deletion.
   *
   * @param id - ID of the category to remove.
   * @returns Deleted category object.
   * @throws ForbiddenException if the category has associated products or sub-categories.
   */
  async remove(id: string) {
    const hasProduct = await this.productRepository.findOne({
      where: { categoryId: id },
    });
    if (hasProduct) {
      throw new ForbiddenException('Category has products attached');
    }

    const hasSubCategory = await this.subCategoryRepository.findOne({
      where: { categoryId: id },
    });
    if (hasSubCategory) {
      throw new ForbiddenException('Category has sub-categories');
    }

    return await this.categoryRepository.delete(id);
  }
}
