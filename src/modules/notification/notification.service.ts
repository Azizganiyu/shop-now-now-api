import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MailService } from 'src/mail/services/mail.service';
import { Brackets, Repository } from 'typeorm';
import { FindNotificationDto } from './dto/find-notification.dto';
import { NotificationDto } from './dto/notification.dto';
import { Notification } from './entities/notification.entity';
import { PageOptionsDto } from 'src/utilities/pagination/dtos';
import { PageMetaDto } from 'src/utilities/pagination/page-meta.dto';
import { PageDto } from 'src/utilities/pagination/page.dto';
import { RequestContextService } from 'src/utilities/request-context.service';
import {
  EmailNotification,
  LocalNotification,
} from './dto/notification-message.dto';
import { User } from '../user/entities/user.entity';
import { HelperService } from 'src/utilities/helper.service';
import { NotificationReadReceipt } from './entities/notification-read-receipt.entity';

@Injectable()
export class NotificationService {
  constructor(
    @InjectRepository(NotificationReadReceipt)
    private readReceiptRepository: Repository<NotificationReadReceipt>,
    @InjectRepository(Notification)
    private notificationRepository: Repository<Notification>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private mailService: MailService,
    private requestContext: RequestContextService,
    private helperService: HelperService,
  ) {}

  /**
   * Send notifications through various channels.
   *
   * @param request - The notification details.
   * @returns A boolean indicating whether the notification was successfully sent.
   */
  async send(request: NotificationDto) {
    let emailSent = false;
    let localSent = false;

    const user: User = request.userId
      ? await this.userRepository.findOneBy({ id: request.userId })
      : null;

    if (request.channels.includes('email')) {
      const mail: EmailNotification = request.message.mail;
      mail.fullName = mail.fullName ?? this.helperService.getFullName(user);
      mail.emailAddress = mail.emailAddress ?? user.email;
      emailSent = await this.sendEmail(mail);
    }

    if (request.channels.includes('local')) {
      localSent = true;
    }

    return await this.save(request, {
      localSent,
      emailSent,
    });
  }

  /**
   * Send an email notification.
   *
   * @param request - The email notification details.
   * @returns A boolean indicating whether the email notification was successfully sent.
   */
  async sendEmail(request: EmailNotification) {
    try {
      if (!request.emailAddress) {
        return false;
      }
      return await this.mailService.sendMail(request);
    } catch (error) {
      console.log(error);
      return false;
    }
  }

  /**
   * Save the notification details.
   *
   * @param request - The notification details.
   * @param status - The status of each notification channel.
   * @returns The saved notification entity.
   */
  async save(
    request: NotificationDto,
    status: {
      emailSent: boolean;
      localSent: boolean;
    },
  ) {
    const create = this.notificationRepository.create({
      message: JSON.stringify(request.message),
      channels: JSON.stringify(request.channels),
      emailSent: status.emailSent,
      localSent: status.localSent,
      userId: request.userId,
      userShared: request.userShared,
    });

    return await this.notificationRepository.save(create);
  }

  /**
   * Find notifications based on filter criteria and pagination options.
   *
   * @param pageOptionsDto - The pagination options.
   * @param filter - The filter criteria.
   * @returns A page of notifications that match the filter criteria.
   */
  async find(pageOptionsDto: PageOptionsDto, filter: FindNotificationDto) {
    const notifications = this.notificationRepository
      .createQueryBuilder('notification')
      .andWhere(
        filter.userId
          ? new Brackets((qb) => {
              qb.where(`notification.userId = :userId`, {
                userId: filter.userId,
              }).orWhere(`notification.userShared = :userShared`, {
                userShared: true,
              });
            })
          : '1=1',
      )
      .andWhere(filter.userId ? `notification.userId = :userId` : '1=1', {
        userId: filter.userId,
      })
      .andWhere(`notification.localSent = :localSent`, {
        localSent: true,
      })
      .andWhere(
        '(notification.id, notification.userId) NOT IN ' +
          '(SELECT notificationId, userId FROM notification_read_receipt)',
      )
      .orderBy('notification.createdAt', pageOptionsDto.order)
      .skip(pageOptionsDto.skip)
      .take(pageOptionsDto.take);
    const itemCount = await notifications.getCount();
    const { entities } = await notifications.getRawAndEntities();
    const result = entities.map((item) => {
      const message: LocalNotification = JSON.parse(item.message).local ?? {};
      item = {
        id: item.id,
        ...message,
        createdAt: item.createdAt,
      };
      return item;
    });
    const pageMetaDto = new PageMetaDto({ itemCount, pageOptionsDto });
    return new PageDto(result, pageMetaDto);
  }

  /**
   * Mark a notification as read by a user.
   *
   * @param notificationId - The ID of the notification to mark as read.
   * @param userId - The ID of the user the notification was read by.
   * @returns The read receipt entity if the notification was successfully marked as read, otherwise null.
   */
  async read(notificationId: string, userId: string) {
    const exist = await this.readReceiptRepository.findOneBy({
      notificationId,
      userId,
    });
    if (exist) {
      return;
    }
    return await this.readReceiptRepository.save({ notificationId, userId });
  }
}
