import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { QuickGuide } from './entities/quick-guide.entity';
import { CreateQuickGuideDto } from './dto/quick-guide.dto';

@Injectable()
export class QuickGuideService {
  constructor(
    @InjectRepository(QuickGuide)
    private quickGuideRepository: Repository<QuickGuide>,
  ) {}

  async createRequest(createDto: CreateQuickGuideDto): Promise<QuickGuide> {
    const request = this.quickGuideRepository.create(createDto);
    return await this.quickGuideRepository.save(request);
  }

  async findAll(includeInactive: any) {
    return includeInactive
      ? await this.quickGuideRepository.find({ order: { createdAt: 'DESC' } })
      : await this.quickGuideRepository.find({
          where: { status: true },
          order: { createdAt: 'DESC' },
        });
  }

  async findOne(id: string): Promise<QuickGuide> {
    return await this.quickGuideRepository.findOneBy({ id });
  }

  async update(id: string, quickGuide: CreateQuickGuideDto) {
    await this.quickGuideRepository.update(id, quickGuide);
    return await this.findOne(id);
  }

  async activate(id: string) {
    return await this.quickGuideRepository.update(id, { status: true });
  }

  async deactivate(id: string) {
    return await this.quickGuideRepository.update(id, { status: false });
  }

  async remove(id: string) {
    return await this.quickGuideRepository.delete(id);
  }
}
