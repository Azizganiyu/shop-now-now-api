import {
  BadGatewayException,
  BadRequestException,
  Injectable,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Location } from './entities/location.entity';
import { CreateLocationDto } from './dto/location.dto';

@Injectable()
export class LocationService {
  constructor(
    @InjectRepository(Location)
    private locationRepository: Repository<Location>,
  ) {}

  async createRequest(createDto: CreateLocationDto): Promise<Location> {
    const exist = await this.locationRepository.findOneBy({
      lgaId: createDto.lgaId,
      bandId: createDto.bandId,
    });
    if (exist) {
      await this.locationRepository.update(exist.id, {
        deliveryPrice: createDto.deliveryPrice,
        canDeliver: createDto.canDeliver,
      });
      return await this.findOne(exist.id);
    }
    const request = this.locationRepository.create(createDto);
    return await this.locationRepository.save(request);
  }

  async findAll(includeInactive: any, bandId: string) {
    if (!bandId) {
      throw new BadGatewayException('bandId is required');
    }
    return includeInactive
      ? await this.locationRepository.find({
          where: { bandId },
          order: { createdAt: 'DESC' },
        })
      : await this.locationRepository.find({
          where: { status: true, bandId },
          order: { createdAt: 'DESC' },
        });
  }

  async findOne(id: string): Promise<Location> {
    return await this.locationRepository.findOneBy({ id });
  }

  async update(id: string, location: CreateLocationDto) {
    await this.locationRepository.update(id, location);
    return await this.findOne(id);
  }

  async activate(id: string) {
    return await this.locationRepository.update(id, { status: true });
  }

  async deactivate(id: string) {
    return await this.locationRepository.update(id, { status: false });
  }

  async remove(id: string) {
    const location = await this.locationRepository.findOne({
      where: { id },
      relations: ['schedules'],
    });
    if (location.schedules.length > 0) {
      throw new BadRequestException(
        'Location has attached schedules, remove schedule or use the disable function',
      );
    }
    return await this.locationRepository.delete(id);
  }
}
