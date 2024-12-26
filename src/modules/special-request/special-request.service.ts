import { Injectable } from '@nestjs/common';
import { SpecialRequest } from './entities/special-request.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { SpecialRequestDto } from './dto/special-request.dto';
import { User } from '../user/entities/user.entity';

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
}
