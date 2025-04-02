import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProductBand } from '../entities/product-band.entity';
import { HelperService } from 'src/utilities/helper.service';
import {
  CreateProductBand,
  UpdateProductBand,
} from '../dto/product-create.dto';
import { Location } from 'src/modules/location/entities/location.entity';
import { ProductCategory } from '../entities/product-category.entity';
import { Schedule } from 'src/modules/schedule/entities/schedule.entity';

@Injectable()
export class ProductBandService {
  constructor(
    @InjectRepository(ProductBand)
    private readonly bandRepository: Repository<ProductBand>,
    @InjectRepository(Location)
    private readonly locationRepository: Repository<Location>,
    @InjectRepository(ProductCategory)
    private readonly categoryRepository: Repository<ProductCategory>,
    @InjectRepository(Schedule)
    private readonly scheduleRepository: Repository<Schedule>,
    private helperService: HelperService,
  ) {}

  /**
   * Retrieve all bands based on user role.
   *
   * If the user role is admin, retrieve all bands.
   * Otherwise, retrieve only active bands.
   *
   * @returns List of bands based on user role.
   */
  async findAll() {
    return await this.bandRepository
      .createQueryBuilder('band')
      .loadRelationCountAndMap('band.categoryCount', 'band.categories')
      .loadRelationCountAndMap('band.locationCount', 'band.locations')
      .loadRelationCountAndMap('band.scheduleCount', 'band.schedules')
      .getMany();
  }

  /**
   * Find a band by its ID.
   *
   * @param id - ID of the band to find.
   * @returns Found band object, or null if not found.
   */
  async findOne(id: string) {
    return await this.bandRepository.findOne({ where: { id } });
  }

  /**
   * Create a new band.
   *
   * @param band - Band data to create.
   * @returns Created band object.
   * @throws BadRequestException if the band name is already taken.
   */
  async create(band: CreateProductBand) {
    const id = this.helperService.idFromName(band.name);
    await this.checkTaken(id);
    const create = await this.bandRepository.create({ id, ...band });
    return await this.bandRepository.save(create);
  }

  /**
   * Check if a band name is already taken.
   *
   * @param id - ID derived from the band name.
   * @throws BadRequestException if the name is already taken.
   */
  async checkTaken(id: string) {
    const exist = await this.findOne(id);
    if (exist) {
      throw new BadRequestException('Name is already taken');
    }
  }

  /**
   * Update a band by its ID.
   *
   * @param id - ID of the band to update.
   * @param band - Updated band data.
   * @returns Updated band object.
   */
  async update(id: string, band: UpdateProductBand) {
    await this.bandRepository.update(id, band);
    return await this.findOne(id);
  }

  /**
   * Remove a band by its ID.
   *
   * Checks if the band has associated products or sub-bands
   * before deletion.
   *
   * @param id - ID of the band to remove.
   * @returns Deleted band object.
   * @throws ForbiddenException if the band has associated products or sub-bands.
   */
  async remove(id: string) {
    await this.categoryRepository.update({ bandId: id }, { bandId: null });
    await this.scheduleRepository.delete({ bandId: id });
    await this.locationRepository.delete({ bandId: id });
    await this.bandRepository.delete(id);
  }
}
