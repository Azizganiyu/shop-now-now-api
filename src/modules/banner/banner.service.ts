import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Banner } from './entities/banner.entity';
import { CreateBannerDto } from './dto/banner.dto';

@Injectable()
export class BannerService {
  constructor(
    @InjectRepository(Banner)
    private bannerRepository: Repository<Banner>,
  ) {}

  async createRequest(createDto: CreateBannerDto): Promise<Banner> {
    const request = this.bannerRepository.create(createDto);
    return await this.bannerRepository.save(request);
  }

  async findAll(includeInactive: any) {
    return includeInactive
      ? await this.bannerRepository.find({ order: { createdAt: 'DESC' } })
      : await this.bannerRepository.find({
          where: { status: true },
          order: { createdAt: 'DESC' },
        });
  }

  async findOne(id: string): Promise<Banner> {
    return await this.bannerRepository.findOneBy({ id });
  }

  async update(id: string, banner: CreateBannerDto) {
    await this.bannerRepository.update(id, banner);
    return await this.findOne(id);
  }

  async activate(id: string) {
    return await this.bannerRepository.update(id, { status: true });
  }

  async deactivate(id: string) {
    return await this.bannerRepository.update(id, { status: false });
  }

  async remove(id: string) {
    return await this.bannerRepository.delete(id);
  }
}
