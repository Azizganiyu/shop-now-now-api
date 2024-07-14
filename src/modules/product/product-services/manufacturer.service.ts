import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { RoleTag } from 'src/constants/roletag';
import { ProductManufacturer } from '../entities/product-manufacturer.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from '../entities/product.entity';
import { Repository } from 'typeorm';
import { RequestContextService } from 'src/utilities/request-context.service';
import {
  CreateProductManufacturer,
  UpdateProductManufacturer,
} from '../dto/product-create.dto';
import { HelperService } from 'src/utilities/helper.service';

@Injectable()
export class ProductManufacturerService {
  constructor(
    @InjectRepository(ProductManufacturer)
    private readonly manufacturerRepository: Repository<ProductManufacturer>,
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    private requestContext: RequestContextService,
    private helperService: HelperService,
  ) {}

  /**
   * Retrieve all manufacturers based on user role.
   *
   * If the user role is admin, retrieve all manufacturers.
   * Otherwise, retrieve only active manufacturers.
   *
   * @returns List of manufacturers based on user role.
   */
  async findAll() {
    return this.requestContext.roleTag === RoleTag.admin
      ? await this.manufacturerRepository.find()
      : await this.manufacturerRepository.findBy({
          status: true,
        });
  }

  /**
   * Find a manufacturer by its ID.
   *
   * @param id - ID of the manufacturer to find.
   * @returns Found manufacturer object, or null if not found.
   */
  async findOne(id: string) {
    return await this.manufacturerRepository.findOne({ where: { id } });
  }

  /**
   * Create a new manufacturer.
   *
   * @param manufacturer - Manufacturer data to create.
   * @returns Created manufacturer object.
   * @throws BadRequestException if the manufacturer name is already taken.
   */
  async create(manufacturer: CreateProductManufacturer) {
    const id = this.helperService.idFromName(manufacturer.name);
    await this.checkTaken(id);
    const create = await this.manufacturerRepository.create({
      id,
      ...manufacturer,
    });
    return await this.manufacturerRepository.save(create);
  }

  /**
   * Check if a manufacturer name is already taken.
   *
   * @param id - ID derived from the manufacturer name.
   * @throws BadRequestException if the name is already taken.
   */
  async checkTaken(id: string) {
    const exist = await this.findOne(id);
    if (exist) {
      throw new BadRequestException('Name is already taken');
    }
  }

  /**
   * Update a manufacturer by its ID.
   *
   * @param id - ID of the manufacturer to update.
   * @param manufacturer - Updated manufacturer data.
   * @returns Updated manufacturer object.
   */
  async update(id: string, manufacturer: UpdateProductManufacturer) {
    await this.manufacturerRepository.update(id, manufacturer);
    return await this.findOne(id);
  }

  /**
   * Activate (enable) a manufacturer by its ID.
   *
   * @param id - ID of the manufacturer to activate.
   * @returns Activated manufacturer object.
   */
  async activate(id: string) {
    return await this.manufacturerRepository.update(id, { status: true });
  }

  /**
   * Deactivate (disable) a manufacturer by its ID.
   *
   * @param id - ID of the manufacturer to deactivate.
   * @returns Deactivated manufacturer object.
   */
  async deactivate(id: string) {
    return await this.manufacturerRepository.update(id, { status: false });
  }

  /**
   * Remove a manufacturer by its ID.
   *
   * Checks if the manufacturer has associated products before deletion.
   *
   * @param id - ID of the manufacturer to remove.
   * @returns Deleted manufacturer object.
   * @throws ForbiddenException if the manufacturer has associated products.
   */
  async remove(id: string) {
    const hasProduct = await this.productRepository.findOne({
      where: { manufacturerId: id },
    });
    if (hasProduct) {
      throw new ForbiddenException('Manufacturer has products attached');
    }

    return await this.manufacturerRepository.delete(id);
  }
}
