import { Injectable } from '@nestjs/common';
import { SpecialRequest } from './entities/special-request.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { SpecialRequestDto } from './dto/special-request.dto';
import { User } from '../user/entities/user.entity';
import { PageMetaDto } from 'src/utilities/pagination/page-meta.dto';
import { PageDto } from 'src/utilities/pagination/page.dto';
import { PageOptionsDto } from 'src/utilities/pagination/dtos';

@Injectable()
export class SpecialRequestService {
  constructor(
    @InjectRepository(SpecialRequest)
    private requestRepository: Repository<SpecialRequest>,
  ) {}

  async create(request: SpecialRequestDto, user: User) {
    const create = this.requestRepository.create({
      ...request,
      userId: user.id,
    });
    return await this.requestRepository.save(create);
  }

  async findAll(pageOptionsDto: PageOptionsDto) {
    const requests = this.requestRepository
      .createQueryBuilder('request')
      .leftJoinAndSelect('request.user', 'user')
      .orderBy('request.createdAt', pageOptionsDto.order)
      .skip(pageOptionsDto.skip)
      .take(pageOptionsDto.take);

    const itemCount = await requests.getCount();
    const { entities } = await requests.getRawAndEntities();
    const pageMetaDto = new PageMetaDto({ itemCount, pageOptionsDto });
    return new PageDto(entities, pageMetaDto);
  }

  async remove(id: string) {
    return await this.requestRepository.delete(id);
  }
}
