import { Injectable } from '@nestjs/common';
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
    const request = this.locationRepository.create(createDto);
    return await this.locationRepository.save(request);
  }

  async findAll(includeInactive: any) {
    return includeInactive
      ? await this.locationRepository.find({ order: { createdAt: 'DESC' } })
      : await this.locationRepository.find({
          where: { status: true },
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
    return await this.locationRepository.delete(id);
  }
}
