import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { RoleTag } from 'src/constants/roletag';
import { ProductStrengthUnit } from '../entities/product-strength-unit.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from '../entities/product.entity';
import { Repository } from 'typeorm';
import { RequestContextService } from 'src/utilities/request-context.service';
import {
  CreateProductStrengthUnit,
  UpdateProductStrengthUnit,
} from '../dto/product-create.dto';
import { HelperService } from 'src/utilities/helper.service';

@Injectable()
export class ProductStrengthUnitService {
  constructor(
    @InjectRepository(ProductStrengthUnit)
    private readonly strengthUnitRepository: Repository<ProductStrengthUnit>,
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    private requestContext: RequestContextService,
    private helperService: HelperService,
  ) {}

  /**
   * Retrieve all strength units based on user role.
   *
   * If the user role is admin, retrieve all strength units.
   * Otherwise, retrieve only active strength units.
   *
   * @returns List of strength units based on user role.
   */
  async findAll() {
    return this.requestContext.roleTag === RoleTag.admin
      ? await this.strengthUnitRepository.find()
      : await this.strengthUnitRepository.findBy({
          status: true,
        });
  }

  /**
   * Find a strength unit by its ID.
   *
   * @param id - ID of the strength unit to find.
   * @returns Found strength unit object, or null if not found.
   */
  async findOne(id: string) {
    return await this.strengthUnitRepository.findOne({ where: { id } });
  }

  /**
   * Create a new strength unit.
   *
   * @param strengthUnit - Strength unit data to create.
   * @returns Created strength unit object.
   * @throws BadRequestException if the strength unit name is already taken.
   */
  async create(strengthUnit: CreateProductStrengthUnit) {
    const id = this.helperService.idFromName(strengthUnit.name);
    await this.checkTaken(id);
    const create = await this.strengthUnitRepository.create({
      id,
      ...strengthUnit,
    });
    return await this.strengthUnitRepository.save(create);
  }

  /**
   * Check if a strength unit name is already taken.
   *
   * @param id - ID derived from the strength unit name.
   * @throws BadRequestException if the name is already taken.
   */
  async checkTaken(id: string) {
    const exist = await this.findOne(id);
    if (exist) {
      throw new BadRequestException('Name is already taken');
    }
  }

  /**
   * Update a strength unit by its ID.
   *
   * @param id - ID of the strength unit to update.
   * @param strengthUnit - Updated strength unit data.
   * @returns Updated strength unit object.
   */
  async update(id: string, strengthUnit: UpdateProductStrengthUnit) {
    await this.strengthUnitRepository.update(id, strengthUnit);
    return await this.findOne(id);
  }

  /**
   * Activate (enable) a strength unit by its ID.
   *
   * @param id - ID of the strength unit to activate.
   * @returns Activated strength unit object.
   */
  async activate(id: string) {
    return await this.strengthUnitRepository.update(id, { status: true });
  }

  /**
   * Deactivate (disable) a strength unit by its ID.
   *
   * @param id - ID of the strength unit to deactivate.
   * @returns Deactivated strength unit object.
   */
  async deactivate(id: string) {
    return await this.strengthUnitRepository.update(id, { status: false });
  }

  /**
   * Remove a strength unit by its ID.
   *
   * Checks if the strength unit has associated products before deletion.
   *
   * @param id - ID of the strength unit to remove.
   * @returns Deleted strength unit object.
   * @throws ForbiddenException if the strength unit has associated products.
   */
  async remove(id: string) {
    const hasProduct = await this.productRepository.findOne({
      where: { strengthUnitId: id },
    });
    if (hasProduct) {
      throw new ForbiddenException('Strength unit has products attached');
    }

    return await this.strengthUnitRepository.delete(id);
  }
}
