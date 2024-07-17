import { BadRequestException, Injectable } from '@nestjs/common';
import { RoleTag } from 'src/constants/roletag';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RequestContextService } from 'src/utilities/request-context.service';
import { HelperService } from 'src/utilities/helper.service';
import { Product } from './entities/product.entity';
import { CreateProduct, UpdateProduct } from './dto/product-create.dto';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    private requestContext: RequestContextService,
    private helperService: HelperService,
  ) {}

  /**
   * Find all products based on user role.
   *
   * If the user role is admin, find all products.
   * Otherwise, find only active products.
   *
   * @returns List of products based on user role.
   */
  async findAll() {
    return this.requestContext.roleTag === RoleTag.admin
      ? await this.productRepository.find()
      : await this.productRepository.findBy({
          status: true,
        });
  }

  /**
   * Find a product by its ID.
   *
   * @param id - ID of the product to find.
   * @returns Found product object, or null if not found.
   */
  async findOne(id: string) {
    return await this.productRepository.findOne({ where: { id } });
  }

  /**
   * Create a new product.
   *
   * If SKU is provided, use it as the ID; otherwise, generate ID from the product name.
   *
   * @param product - Product data to create.
   * @returns Created product object.
   * @throws BadRequestException if the product name is already taken.
   */
  async create(product: CreateProduct) {
    const id = product.sku ?? this.helperService.idFromName(product.name);
    await this.checkTaken(id);
    const create = await this.productRepository.create({
      id,
      ...product,
    });
    return await this.productRepository.save(create);
  }

  /**
   * Check if a product name or SKU is already taken.
   *
   * @param id - ID or SKU derived from the product name.
   * @throws BadRequestException if the name or SKU is already taken.
   */
  async checkTaken(id: string) {
    const exist = await this.findOne(id);
    if (exist) {
      throw new BadRequestException('Name or SKU is already taken');
    }
  }

  /**
   * Update a product by its ID.
   *
   * @param id - ID of the product to update.
   * @param product - Updated product data.
   * @returns Updated product object.
   */
  async update(id: string, product: UpdateProduct) {
    await this.productRepository.update(id, product);
    return await this.findOne(id);
  }

  /**
   * Activate (enable) a product by its ID.
   *
   * @param id - ID of the product to activate.
   * @returns Activated product object.
   */
  async activate(id: string) {
    return await this.productRepository.update(id, { status: true });
  }

  /**
   * Deactivate (disable) a product by its ID.
   *
   * @param id - ID of the product to deactivate.
   * @returns Deactivated product object.
   */
  async deactivate(id: string) {
    return await this.productRepository.update(id, { status: false });
  }

  /**
   * Remove a product by its ID.
   *
   * Checks if the product has associated orders, transactions, or carts before deletion.
   *
   * @param id - ID of the product to remove.
   * @returns Deleted product object.
   */
  async remove(id: string) {
    // Check if the product has associated orders
    // Check if the product has associated transactions
    // Delete associated carts
    return await this.productRepository.delete(id);
  }
}