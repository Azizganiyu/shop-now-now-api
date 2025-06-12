import {
  BadRequestException,
  Injectable,
  UnprocessableEntityException,
} from '@nestjs/common';
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
        filter.admin == 'false' ? `category.status = :categoryStatus` : '1=1',
        {
          categoryStatus: true,
        },
      )
      .andWhere(
        !filter.admin || filter.admin != 'true'
          ? `product.status = :status`
          : '1=1',
        {
          status: true,
        },
      )
      .andWhere(
        !filter.admin || filter.admin != 'true'
          ? `category.bandId IS NOT NULL`
          : '1=1',
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
              const keywords = filter.search.trim().split(/\s+/);
              keywords.forEach((keyword, index) => {
                qb.orWhere(
                  `product.name LIKE :kw${index} OR product.description LIKE :kw${index}`,
                  { [`kw${index}`]: `%${keyword}%` },
                );
              });
            })
          : '1=1',
      )
      .andWhere(filter.from ? `product.createdAt >= :fromDate` : '1=1', {
        fromDate: filter.from,
      })
      .andWhere(filter.to ? `product.createdAt <= :toDate` : '1=1', {
        toDate: filter.to,
      });

    if (filter.search) {
      const keywords = filter.search.trim().split(/\s+/);

      const keywordParams = keywords.reduce(
        (acc, kw, i) => {
          acc[`kw${i}`] = `%${kw}%`;
          return acc;
        },
        {} as Record<string, string>,
      );

      products.addSelect(
        `
          (
            CASE 
              WHEN product.name LIKE :exact THEN 100
              WHEN product.description LIKE :exact THEN 90
              ELSE 0
            END
            +
            ${keywords
              .map(
                (_, i) => `
                  (CASE WHEN product.name LIKE :kw${i} THEN 10 ELSE 0 END)
                  +
                  (CASE WHEN product.description LIKE :kw${i} THEN 5 ELSE 0 END)
                `,
              )
              .join(' + ')}
          )
        `,
        'match_score',
      );

      products.setParameters({
        exact: `%${filter.search.trim()}%`,
        ...keywordParams,
      });

      products.orderBy('match_score', 'DESC');
    } else {
      products.orderBy('product.createdAt', pageOptionsDto.order);
    }

    products.skip(pageOptionsDto.skip).take(pageOptionsDto.take);

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
    if (!product.sku) {
      product.sku = this.helperService.idFromName(product.name);
    }
    product.sku = await this.checkSkuTaken(product.sku);
    if (!product.sellingPrice) {
      if (!category.band.sellingPricePercentage) {
        throw new UnprocessableEntityException('Selling price is required');
      }
      const percentage = category.band.sellingPricePercentage;
      product.sellingPrice =
        (percentage / 100) * product.costPrice + product.costPrice;
    }
    const create = await this.productRepository.create({
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
  async checkSkuTaken(sku: string) {
    const exist = await this.productRepository.findOne({ where: { sku } });
    if (exist) {
      return `${sku}-${this.helperService.generateRandomString()}`;
    }
    return sku;
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
      if (!category.band.sellingPricePercentage) {
        throw new UnprocessableEntityException('Selling price is required');
      }
      const percentage = category.band.sellingPricePercentage;
      product.sellingPrice =
        (percentage / 100) * product.costPrice + product.costPrice;
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
    const product = await this.productRepository.findOne({
      where: { id },
      relations: ['carts', 'reviews', 'orderItems', 'wishItems'],
    });
    if (
      product.carts.length > 0 ||
      product.reviews.length > 0 ||
      product.orderItems.length > 0 ||
      product.wishItems.length > 0
    ) {
      throw new BadRequestException(
        'Product can not be removed at this time, please use the disable function',
      );
    }
    return await this.productRepository.delete(id);
  }
}
