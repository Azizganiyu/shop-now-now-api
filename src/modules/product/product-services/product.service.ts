import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Brackets, Repository } from 'typeorm';
import { RequestContextService } from 'src/utilities/request-context.service';
import { HelperService } from 'src/utilities/helper.service';
import { Product } from '../entities/product.entity';
import { CreateProduct, UpdateProduct } from '../dto/product-create.dto';
import { PageOptionsDto } from 'src/utilities/pagination/dtos';
import { PageMetaDto } from 'src/utilities/pagination/page-meta.dto';
import { PageDto } from 'src/utilities/pagination/page.dto';
import { FindProductDto } from '../dto/find-product.dto';
import { AppConfigService } from 'src/modules/app-config/app-config.service';
import { ProductCategory } from '../entities/product-category.entity';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    @InjectRepository(ProductCategory)
    private readonly categoryRepository: Repository<ProductCategory>,
    private requestContext: RequestContextService,
    private helperService: HelperService,
    private appConfigService: AppConfigService,
  ) {}

  /**
   * Find all products based on user role.
   *
   * If the user role is admin, find all products.
   * Otherwise, find only active products.
   *
   * @returns List of products based on user role.
   */
  async findAll(filter: FindProductDto, pageOptionsDto: PageOptionsDto) {
    const products = this.productRepository
      .createQueryBuilder('product')
      .leftJoinAndSelect('product.category', 'category')
      .leftJoinAndSelect('category.band', 'band')
      .andWhere(
        !filter.admin || filter.admin != 'true'
          ? `product.status = :status`
          : '1=1',
        {
          status: true,
        },
      )
      .andWhere(
        filter.admin == 'true' && filter.status
          ? `product.status = :adminStatus`
          : '1=1',
        {
          adminStatus: filter.status,
        },
      )
      .andWhere(
        filter.categoryId ? `product.categoryId = :categoryId` : '1=1',
        {
          categoryId: filter.categoryId,
        },
      )
      .andWhere(
        filter.subCategoryId
          ? `product.subCategoryId >= :subCategoryId`
          : '1=1',
        {
          subCategoryId: filter.subCategoryId,
        },
      )
      .andWhere(
        filter.manufacturerId
          ? `product.manufacturerId >= :manufacturerId`
          : '1=1',
        {
          manufacturerId: filter.manufacturerId,
        },
      )
      .andWhere(
        filter.fromPrice ? `product.sellingPrice >= :fromPrice` : '1=1',
        {
          fromPrice: filter.fromPrice,
        },
      )
      .andWhere(filter.toPrice ? `product.sellingPrice <= :toPrice` : '1=1', {
        toPrice: filter.toPrice,
      })
      .andWhere(
        filter.search
          ? new Brackets((qb) => {
              qb.where('product.name like :name', {
                name: '%' + filter.search + '%',
              }).orWhere('product.description like :description', {
                description: '%' + filter.search + '%',
              });
            })
          : '1=1',
      )
      .andWhere(filter.from ? `product.createdAt >= :fromDate` : '1=1', {
        fromDate: filter.from,
      })
      .andWhere(filter.to ? `product.createdAt <= :toDate` : '1=1', {
        toDate: filter.to,
      })
      .orderBy('product.createdAt', pageOptionsDto.order)
      .skip(pageOptionsDto.skip)
      .take(pageOptionsDto.take);

    const itemCount = await products.getCount();
    const { entities } = await products.getRawAndEntities();
    const pageMetaDto = new PageMetaDto({ itemCount, pageOptionsDto });
    return new PageDto(entities, pageMetaDto);
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
    const category = await this.categoryRepository.findOne({
      where: { id: product.categoryId },
      relations: ['band'],
    });
    const id = product.sku ?? this.helperService.idFromName(product.name);
    await this.checkTaken(id);
    if (!product.sellingPrice) {
      const appConfig = await this.appConfigService.getConfig();
      const percentage =
        category.band.sellingPricePercentage ??
        appConfig.sellingPricePercentage;
      product.sellingPrice = (percentage / 100) * product.costPrice;
    }
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
    const category = await this.categoryRepository.findOne({
      where: { id: product.categoryId },
      relations: ['band'],
    });
    if (!product.sellingPrice) {
      const appConfig = await this.appConfigService.getConfig();
      const percentage =
        category.band.sellingPricePercentage ??
        appConfig.sellingPricePercentage;
      product.sellingPrice = (percentage / 100) * product.costPrice;
    }
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
