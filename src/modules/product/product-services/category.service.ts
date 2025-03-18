import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Not, Repository } from 'typeorm';
import { ProductCategory } from '../entities/product-category.entity';
import { Product } from '../entities/product.entity';
import { HelperService } from 'src/utilities/helper.service';
import {
  CreateProductCategory,
  UpdateProductCategory,
} from '../dto/product-create.dto';

@Injectable()
export class ProductCategoryService {
  constructor(
    @InjectRepository(ProductCategory)
    private readonly categoryRepository: Repository<ProductCategory>,
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
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
  async findAll(includeInactive: any) {
    return includeInactive
      ? await this.categoryRepository
          .createQueryBuilder('category')
          .leftJoinAndSelect('category.band', 'band')
          .loadRelationCountAndMap('category.productCount', 'category.products')
          .orderBy('category.order', 'ASC')
          .getMany()
      : await this.categoryRepository.find({
          where: { status: true },
          order: { order: 'ASC' },
        });
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

    let newOrder;
    let lastOrder = 0;
    const categories = await this.categoryRepository.find({
      order: { order: 'DESC' },
    });
    if (categories.length > 0) {
      lastOrder = categories[0].order;
    }
    if (category.order) {
      newOrder = category.order;
      const orderExist = await this.categoryRepository.findOneBy({
        order: category.order,
      });
      if (orderExist) {
        await this.categoryRepository.update(orderExist.id, {
          order: lastOrder + 1,
        });
      }
    } else {
      newOrder = lastOrder + 1;
    }
    const create = await this.categoryRepository.create({
      id,
      ...category,
      order: newOrder,
    });
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
    let newOrder;
    let lastOrder = 0;
    const categories = await this.categoryRepository.find({
      order: { order: 'DESC' },
    });
    lastOrder = categories[0].order;
    if (category.order) {
      newOrder = category.order;
      const orderExist = await this.categoryRepository.findOneBy({
        order: category.order,
        id: Not(id),
      });
      if (orderExist) {
        await this.categoryRepository.update(orderExist.id, {
          order: lastOrder + 1,
        });
      }
    } else {
      newOrder = lastOrder + 1;
    }
    await this.categoryRepository.update(id, { ...category, order: newOrder });
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

    return await this.categoryRepository.delete(id);
  }
}
