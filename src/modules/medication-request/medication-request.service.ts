import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MedicationRequest } from './entity/medication-request.entity';
import { CreateMedicationRequestDto } from './dto/medication-request.dto';
import { PageOptionsDto } from 'src/utilities/pagination/dtos';
import { PageMetaDto } from 'src/utilities/pagination/page-meta.dto';
import { PageDto } from 'src/utilities/pagination/page.dto';
import { FindMedicationRequestDto } from './dto/find-medication-request.dto';

@Injectable()
export class MedicationRequestService {
  constructor(
    @InjectRepository(MedicationRequest)
    private medicationRequestRepository: Repository<MedicationRequest>,
  ) {}

  async createRequest(
    createDto: CreateMedicationRequestDto,
  ): Promise<MedicationRequest> {
    const request = this.medicationRequestRepository.create(createDto);
    return await this.medicationRequestRepository.save(request);
  }

  async findAll(
    filter: FindMedicationRequestDto,
    pageOptionsDto: PageOptionsDto,
  ) {
    const medications = this.medicationRequestRepository
      .createQueryBuilder('medication')
      .andWhere(filter.from ? `medication.createdAt >= :fromDate` : '1=1', {
        fromDate: filter.from,
      })
      .andWhere(filter.to ? `medication.createdAt <= :toDate` : '1=1', {
        toDate: filter.to,
      })
      .orderBy('medication.createdAt', pageOptionsDto.order);

    const itemCount = await medications.getCount();
    const { entities } = await medications.getRawAndEntities();
    const pageMetaDto = new PageMetaDto({ itemCount, pageOptionsDto });
    return new PageDto(entities, pageMetaDto);
  }

  async findOne(id: string): Promise<MedicationRequest> {
    return await this.medicationRequestRepository.findOneBy({ id });
  }
}
