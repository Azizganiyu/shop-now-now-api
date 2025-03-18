import { BadGatewayException, Injectable } from '@nestjs/common';
import { GetSlotDto, ScheduleDto } from './dto/schedule.dto';
import { Schedule } from './entities/schedule.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Repository } from 'typeorm';
import { PageOptionsDto } from 'src/utilities/pagination/dtos';
import { PageMetaDto } from 'src/utilities/pagination/page-meta.dto';
import { PageDto } from 'src/utilities/pagination/page.dto';
import { Location } from '../location/entities/location.entity';

@Injectable()
export class ScheduleService {
  constructor(
    @InjectRepository(Schedule)
    private scheduleRepository: Repository<Schedule>,
    @InjectRepository(Location)
    private locationRepository: Repository<Location>,
  ) {}

  async save(request: ScheduleDto) {
    const exist = await this.scheduleRepository.findOneBy({
      locationId: request.locationId ?? IsNull(),
      day: request.day,
      bandId: request.bandId,
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

  async findAll(pageOptionsDto: PageOptionsDto, bandId: string) {
    if (!bandId) {
      throw new BadGatewayException('bandId is required');
    }
    const schedules = this.scheduleRepository
      .createQueryBuilder('schedule')
      .where('schedule.bandId = :bandId', { bandId })
      .leftJoinAndSelect('schedule.location', 'location')
      .leftJoinAndSelect('location.lga', 'lga')
      .orderBy('schedule.createdAt', pageOptionsDto.order)
      .skip(pageOptionsDto.skip)
      .take(pageOptionsDto.take);

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

  async getLocationSchedules(locationId: string) {
    const defaultSlots = await this.scheduleRepository.findBy({
      locationId: IsNull(),
      status: true,
    });
    const locationSlots = await this.scheduleRepository.findBy({
      locationId: locationId,
      status: true,
    });

    defaultSlots.forEach((slot) => {
      if (!locationSlots.find((ls) => ls.day == slot.day)) {
        locationSlots.push(slot);
      }
    });

    const daysOrder = [
      'sunday',
      'monday',
      'tuesday',
      'wednesday',
      'thursday',
      'friday',
      'saturday',
    ];

    locationSlots.sort((a, b) => {
      return (
        daysOrder.indexOf(a.day.toLowerCase()) -
        daysOrder.indexOf(b.day.toLowerCase())
      );
    });

    return locationSlots;
  }

  async getSlots(request: GetSlotDto) {
    const dayOfWeek = this.getDayOfWeek(request.date);
    let schedule: Schedule = null;
    for (const bandId of request.bands) {
      const location = await this.locationRepository.findOneBy({
        bandId,
        lgaId: request.lgaId,
      });
      if (location) {
        const foundSchedule = await this.scheduleRepository.findOneBy({
          day: dayOfWeek,
          bandId,
          locationId: location.id,
        });
        if (foundSchedule) {
          schedule = foundSchedule;
        }
      }
    }

    if (!schedule) {
      for (const bandId of request.bands) {
        const foundSchedule = await this.scheduleRepository.findOneBy({
          day: dayOfWeek,
          bandId,
        });
        if (foundSchedule) {
          schedule = foundSchedule;
        }
      }
    }

    if (!schedule) {
      return [];
    }

    return this.generateTimeSlots(
      request.date,
      schedule.start,
      schedule.end,
      schedule.interval,
    );
  }

  getDayOfWeek(dateString) {
    const date = new Date(dateString);
    const days = [
      'Sunday',
      'Monday',
      'Tuesday',
      'Wednesday',
      'Thursday',
      'Friday',
      'Saturday',
    ];
    return days[date.getDay()];
  }

  // generateTimeSlots(
  //   date: Date,
  //   startTime: string,
  //   endTime: string,
  //   intervalMinutes: number,
  // ): { twentyFourHour: string; twelveHour: string }[] {
  //   let result: { twentyFourHour: string; twelveHour: string }[] = [];
  //   const now = new Date();
  //   const inputDate = new Date(date);

  //   // Parse start and end times
  //   const [startHour, startMinute] = startTime.split(':').map(Number);
  //   const [endHour, endMinute] = endTime.split(':').map(Number);

  //   // Create Date objects for start and end times
  //   const startDate = new Date(inputDate);
  //   startDate.setHours(startHour, startMinute, 0, 0);

  //   const endDate = new Date(inputDate);
  //   endDate.setHours(endHour, endMinute, 0, 0);

  //   // Generate all time slots
  //   const slot = new Date(startDate);
  //   while (slot <= endDate) {
  //     const twentyFourHour = slot.toTimeString().slice(0, 5); // Format HH:mm
  //     const twelveHour = this.formatToTwelveHour(slot);
  //     result.push({ twentyFourHour, twelveHour });
  //     slot.setMinutes(slot.getMinutes() + intervalMinutes);
  //   }

  //   // If the date is today, filter slots
  //   if (inputDate.toDateString() === now.toDateString()) {
  //     const twoHoursAhead = new Date(now);
  //     twoHoursAhead.setHours(now.getHours() + 2, 0, 0, 0); // 2 hours from now, aligned to the hour

  //     // Filter slots to include only those at least 2 hours ahead
  //     result = result.filter(({ twentyFourHour }) => {
  //       const [hour, minute] = twentyFourHour.split(':').map(Number);
  //       const slotTime = new Date(inputDate);
  //       slotTime.setHours(hour, minute, 0, 0);
  //       return slotTime >= twoHoursAhead;
  //     });
  //   }
  //   return result;
  // }

  generateTimeSlots(
    date: Date,
    startTime: string,
    endTime: string,
    intervalMinutes: number,
  ): {
    slotStart: { twentyFourHour: string; twelveHour: string };
    slotEnd: { twentyFourHour: string; twelveHour: string };
    runningTime?: string;
  }[] {
    const slots = [];
    const [startHour, startMinute] = startTime.split(':').map(Number);
    const [endHour, endMinute] = endTime.split(':').map(Number);

    const now = new Date();
    let currentTime = new Date(date);
    currentTime.setHours(startHour, startMinute, 0, 0);

    const endTimeObj = new Date(date);
    endTimeObj.setHours(endHour, endMinute, 0, 0);

    // If the start time is in the past, adjust it to the next closest 30-minute mark
    if (currentTime < now) {
      let adjustedHour = now.getHours();
      let adjustedMinute = now.getMinutes();

      // Round up to the nearest 30-minute mark
      adjustedMinute =
        adjustedMinute % 30 === 0
          ? adjustedMinute
          : Math.ceil(adjustedMinute / 30) * 30;

      // If rounding pushed it to 60, increment the hour
      if (adjustedMinute === 60) {
        adjustedHour += 1;
        adjustedMinute = 0;
      }

      currentTime.setHours(adjustedHour, adjustedMinute, 0, 0);
    }

    const formatTime = (date: Date) => {
      const hours24 = date.getHours().toString().padStart(2, '0');
      const minutes = date.getMinutes().toString().padStart(2, '0');
      const hours12 = (date.getHours() % 12 || 12).toString().padStart(2, '0');
      const period = date.getHours() >= 12 ? 'PM' : 'AM';

      return {
        twentyFourHour: `${hours24}:${minutes}`,
        twelveHour: `${hours12}:${minutes} ${period}`,
      };
    };

    while (currentTime < endTimeObj) {
      const slotStart = new Date(currentTime);
      const slotEnd = new Date(slotStart);
      slotEnd.setMinutes(slotEnd.getMinutes() + intervalMinutes);

      if (slotEnd > endTimeObj) break;

      const startFormatted = formatTime(slotStart);
      const endFormatted = formatTime(slotEnd);

      slots.push({
        slotStart: startFormatted,
        slotEnd: endFormatted,
        runningTime: `${startFormatted.twelveHour} - ${endFormatted.twelveHour}`,
      });

      currentTime = slotEnd;
    }

    return slots;
  }

  // addMinutes(timeString: string, minutesToAdd: number): string {
  //   const [hours, minutes] = timeString.split(':').map(Number);
  //   const date = new Date();
  //   date.setHours(hours, minutes + minutesToAdd, 0, 0);
  //   return this.formatToTwelveHour(date);
  // }

  // // Function to format time to 12-hour format
  // formatToTwelveHour(date: Date): string {
  //   console.log('DATE', date);
  //   let hours = date.getHours();
  //   const minutes = date.getMinutes();
  //   const ampm = hours >= 12 ? 'PM' : 'AM';
  //   hours = hours % 12 || 12; // Convert 24-hour format to 12-hour format
  //   return `${hours}:${minutes.toString().padStart(2, '0')} ${ampm}`;
  // }
}
