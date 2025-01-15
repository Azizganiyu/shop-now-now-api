import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Faq } from './entities/faq.entity';
import { CreateFaqDto } from './dto/faq.dto';

@Injectable()
export class FaqService {
  constructor(
    @InjectRepository(Faq)
    private faqRepository: Repository<Faq>,
  ) {}

  async createRequest(createDto: CreateFaqDto): Promise<Faq> {
    const request = this.faqRepository.create(createDto);
    return await this.faqRepository.save(request);
  }

  async findAll(includeInactive: any) {
    return includeInactive
      ? await this.faqRepository.find({ order: { createdAt: 'DESC' } })
      : await this.faqRepository.find({
          where: { status: true },
          order: { createdAt: 'DESC' },
        });
  }

  async findOne(id: string): Promise<Faq> {
    return await this.faqRepository.findOneBy({ id });
  }

  async update(id: string, faq: CreateFaqDto) {
    await this.faqRepository.update(id, faq);
    return await this.findOne(id);
  }

  async activate(id: string) {
    return await this.faqRepository.update(id, { status: true });
  }

  async deactivate(id: string) {
    return await this.faqRepository.update(id, { status: false });
  }

  async remove(id: string) {
    return await this.faqRepository.delete(id);
  }
}
