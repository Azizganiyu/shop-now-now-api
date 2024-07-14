import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { RoleTag } from 'src/constants/roletag';
import { ProductPresentation } from '../entities/product-presentation.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from '../entities/product.entity';
import { Repository } from 'typeorm';
import { RequestContextService } from 'src/utilities/request-context.service';
import {
  CreateProductPresentation,
  UpdateProductPresentation,
} from '../dto/product-create.dto';
import { HelperService } from 'src/utilities/helper.service';

@Injectable()
export class ProductPresentationService {
  constructor(
    @InjectRepository(ProductPresentation)
    private readonly presentationRepository: Repository<ProductPresentation>,
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    private requestContext: RequestContextService,
    private helperService: HelperService,
  ) {}

  /**
   * Retrieve all presentations based on user role.
   *
   * If the user role is admin, retrieve all presentations.
   * Otherwise, retrieve only active presentations.
   *
   * @returns List of presentations based on user role.
   */
  async findAll() {
    return this.requestContext.roleTag === RoleTag.admin
      ? await this.presentationRepository.find()
      : await this.presentationRepository.findBy({
          status: true,
        });
  }

  /**
   * Find a presentation by its ID.
   *
   * @param id - ID of the presentation to find.
   * @returns Found presentation object, or null if not found.
   */
  async findOne(id: string) {
    return await this.presentationRepository.findOne({ where: { id } });
  }

  /**
   * Create a new presentation.
   *
   * @param presentation - Presentation data to create.
   * @returns Created presentation object.
   * @throws BadRequestException if the presentation name is already taken.
   */
  async create(presentation: CreateProductPresentation) {
    const id = this.helperService.idFromName(presentation.name);
    await this.checkTaken(id);
    const create = await this.presentationRepository.create({
      id,
      ...presentation,
    });
    return await this.presentationRepository.save(create);
  }

  /**
   * Check if a presentation name is already taken.
   *
   * @param id - ID derived from the presentation name.
   * @throws BadRequestException if the name is already taken.
   */
  async checkTaken(id: string) {
    const exist = await this.findOne(id);
    if (exist) {
      throw new BadRequestException('Name is already taken');
    }
  }

  /**
   * Update a presentation by its ID.
   *
   * @param id - ID of the presentation to update.
   * @param presentation - Updated presentation data.
   * @returns Updated presentation object.
   */
  async update(id: string, presentation: UpdateProductPresentation) {
    await this.presentationRepository.update(id, presentation);
    return await this.findOne(id);
  }

  /**
   * Activate (enable) a presentation by its ID.
   *
   * @param id - ID of the presentation to activate.
   * @returns Activated presentation object.
   */
  async activate(id: string) {
    return await this.presentationRepository.update(id, { status: true });
  }

  /**
   * Deactivate (disable) a presentation by its ID.
   *
   * @param id - ID of the presentation to deactivate.
   * @returns Deactivated presentation object.
   */
  async deactivate(id: string) {
    return await this.presentationRepository.update(id, { status: false });
  }

  /**
   * Remove a presentation by its ID.
   *
   * Checks if the presentation has associated products before deletion.
   *
   * @param id - ID of the presentation to remove.
   * @returns Deleted presentation object.
   * @throws ForbiddenException if the presentation has associated products.
   */
  async remove(id: string) {
    const hasProduct = await this.productRepository.findOne({
      where: { presentationId: id },
    });
    if (hasProduct) {
      throw new ForbiddenException('Presentation has products attached');
    }

    return await this.presentationRepository.delete(id);
  }
}
