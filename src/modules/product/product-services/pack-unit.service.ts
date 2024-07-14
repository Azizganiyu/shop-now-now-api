import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { RoleTag } from 'src/constants/roletag';
import { ProductPackUnit } from '../entities/product-pack-unit.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from '../entities/product.entity';
import { Repository } from 'typeorm';
import { RequestContextService } from 'src/utilities/request-context.service';
import {
  CreateProductPackUnit,
  UpdateProductPackUnit,
} from '../dto/product-create.dto';
import { HelperService } from 'src/utilities/helper.service';

@Injectable()
export class ProductPackUnitService {
  constructor(
    @InjectRepository(ProductPackUnit)
    private readonly packUnitRepository: Repository<ProductPackUnit>,
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    private requestContext: RequestContextService,
    private helperService: HelperService,
  ) {}

  /**
   * Retrieve all pack units based on user role.
   *
   * If the user role is admin, retrieve all pack units.
   * Otherwise, retrieve only active pack units.
   *
   * @returns List of pack units based on user role.
   */
  async findAll() {
    return this.requestContext.roleTag === RoleTag.admin
      ? await this.packUnitRepository.find()
      : await this.packUnitRepository.findBy({
          status: true,
        });
  }

  /**
   * Find a pack unit by its ID.
   *
   * @param id - ID of the pack unit to find.
   * @returns Found pack unit object, or null if not found.
   */
  async findOne(id: string) {
    return await this.packUnitRepository.findOne({ where: { id } });
  }

  /**
   * Create a new pack unit.
   *
   * @param packUnit - Pack unit data to create.
   * @returns Created pack unit object.
   * @throws BadRequestException if the pack unit name is already taken.
   */
  async create(packUnit: CreateProductPackUnit) {
    const id = this.helperService.idFromName(packUnit.name);
    await this.checkTaken(id);
    const create = await this.packUnitRepository.create({ id, ...packUnit });
    return await this.packUnitRepository.save(create);
  }

  /**
   * Check if a pack unit name is already taken.
   *
   * @param id - ID derived from the pack unit name.
   * @throws BadRequestException if the name is already taken.
   */
  async checkTaken(id: string) {
    const exist = await this.findOne(id);
    if (exist) {
      throw new BadRequestException('Name is already taken');
    }
  }

  /**
   * Update a pack unit by its ID.
   *
   * @param id - ID of the pack unit to update.
   * @param packUnit - Updated pack unit data.
   * @returns Updated pack unit object.
   */
  async update(id: string, packUnit: UpdateProductPackUnit) {
    await this.packUnitRepository.update(id, packUnit);
    return await this.findOne(id);
  }

  /**
   * Activate (enable) a pack unit by its ID.
   *
   * @param id - ID of the pack unit to activate.
   * @returns Activated pack unit object.
   */
  async activate(id: string) {
    return await this.packUnitRepository.update(id, { status: true });
  }

  /**
   * Deactivate (disable) a pack unit by its ID.
   *
   * @param id - ID of the pack unit to deactivate.
   * @returns Deactivated pack unit object.
   */
  async deactivate(id: string) {
    return await this.packUnitRepository.update(id, { status: false });
  }

  /**
   * Remove a pack unit by its ID.
   *
   * Checks if the pack unit has associated products before deletion.
   *
   * @param id - ID of the pack unit to remove.
   * @returns Deleted pack unit object.
   * @throws ForbiddenException if the pack unit has associated products.
   */
  async remove(id: string) {
    const hasProduct = await this.productRepository.findOne({
      where: { packUnitId: id },
    });
    if (hasProduct) {
      throw new ForbiddenException('Pack unit has products attached');
    }

    return await this.packUnitRepository.delete(id);
  }
}
