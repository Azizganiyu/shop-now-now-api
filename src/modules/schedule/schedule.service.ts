import { Injectable } from '@nestjs/common';
import { ScheduleDto } from './dto/schedule.dto';
import { Schedule } from './entities/schedule.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Repository } from 'typeorm';
import { PageOptionsDto } from 'src/utilities/pagination/dtos';
import { PageMetaDto } from 'src/utilities/pagination/page-meta.dto';
import { PageDto } from 'src/utilities/pagination/page.dto';

@Injectable()
export class ScheduleService {
  constructor(
    @InjectRepository(Schedule)
    private scheduleRepository: Repository<Schedule>,
  ) {}

  async save(request: ScheduleDto) {
    const exist = await this.scheduleRepository.findOneBy({
      locationId: request.locationId ?? IsNull(),
      day: request.day,
    });
    if (exist) {
      return await this.scheduleRepository.save({ ...exist, ...request });
    }
    const create = await this.scheduleRepository.create({
      locationId: request.locationId ?? null,
      ...request,
    });
    return await this.scheduleRepository.save(create);
  }

  async findAll(pageOptionsDto: PageOptionsDto) {
    const schedules = this.scheduleRepository
      .createQueryBuilder('schedule')
      .leftJoinAndSelect('schedule.location', 'location')
      .orderBy('schedule.createdAt', pageOptionsDto.order);

    const itemCount = await schedules.getCount();
    const { entities } = await schedules.getRawAndEntities();
    const pageMetaDto = new PageMetaDto({ itemCount, pageOptionsDto });
    return new PageDto(entities, pageMetaDto);
  }

  async activate(id: string) {
    return await this.scheduleRepository.update(id, { status: true });
  }

  async deactivate(id: string) {
    return await this.scheduleRepository.update(id, { status: false });
  }

  async delete(scheduleId: string) {
    return await this.scheduleRepository.delete(scheduleId);
  }
}
