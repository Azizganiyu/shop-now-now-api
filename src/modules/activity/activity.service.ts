import { Injectable, ServiceUnavailableException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ActivityDto } from './dto/activity.dto';
import { Activity } from './entities/activity.entity';
import { PageMetaDto } from 'src/utilities/pagination/page-meta.dto';
import { PageDto } from 'src/utilities/pagination/page.dto';
import { Log } from './entities/log.entity';
import { PageOptionsDto } from 'src/utilities/pagination/dtos';

@Injectable()
export class ActivityService {
  constructor(
    @InjectRepository(Activity)
    private activityRepository: Repository<Activity>,
    @InjectRepository(Log) private logRepository: Repository<Log>,
  ) {}

  /**
   * Finds all activities based on the provided filter and pagination options.
   *
   * @param {ActivityDto} filter The filter criteria for activities.
   * @param {PageOptionsDto} pageOptionsDto The pagination options.
   * @returns {Promise<PageDto>} A promise that resolves with a PageDto containing the retrieved activities.
   */
  async findAll(filter: ActivityDto, pageOptionsDto: PageOptionsDto) {
    const activities = this.activityRepository
      .createQueryBuilder('activity')
      .leftJoinAndSelect('activity.user', 'user')
      .andWhere(filter.userId ? 'activity.userId = :userId' : '1=1', {
        userId: filter.userId,
      })
      .andWhere(filter.ip ? 'activity.ipAddress = :ip' : '1=1', {
        ip: filter.ip,
      })
      .andWhere(filter.event ? 'activity.event = :event' : '1=1', {
        event: filter.event,
      })
      .andWhere(filter.from ? `activity.createdAt >= :fromDate` : '1=1', {
        fromDate: filter.from,
      })
      .andWhere(filter.to ? `activity.createdAt <= :toDate` : '1=1', {
        toDate: filter.to,
      })
      .orderBy('activity.createdAt', pageOptionsDto.order)
      .skip(pageOptionsDto.skip)
      .take(pageOptionsDto.take);
    const itemCount = await activities.getCount();
    const { entities } = await activities.getRawAndEntities();
    const pageMetaDto = new PageMetaDto({ itemCount, pageOptionsDto });
    return new PageDto(entities, pageMetaDto);
  }

  /**
   * Creates a new activity.
   *
   * @param {Activity} data The data for creating the activity.
   * @returns {Promise<Activity>} A promise that resolves with the created activity.
   * @throws {ServiceUnavailableException} Thrown if there was an error while saving the activity.
   */
  async create(data: Activity) {
    try {
      const activity = this.activityRepository.create(data);
      return await this.activityRepository.save(activity);
    } catch (error) {
      throw new ServiceUnavailableException(error);
    }
  }

  /**
   * Logs a message with the specified type (defaults to 'debug').
   *
   * @param {any} message The message to log.
   * @param {string} type The type of the log message (default: 'debug').
   * @returns {Promise<Log>} A promise that resolves with the logged data.
   */
  async log(message, type = 'debug') {
    message = message ?? 'empty log message';
    console.log(new Date().toISOString());
    console.dir(message, { depth: null });
    try {
      message = JSON.stringify(message);
    } catch (error) {
      message = 'log error';
    }
    try {
      const data = await this.logRepository.create({ message, type });
      return await this.logRepository.save(data);
    } catch (error) {
      console.log('unable to store log');
    }
  }
}
