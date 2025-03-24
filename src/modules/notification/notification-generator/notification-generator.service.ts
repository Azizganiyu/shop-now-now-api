import { Injectable } from '@nestjs/common';
import {
  MessageAttachment,
  NotificationChannels,
  NotificationDto,
} from '../dto/notification.dto';
import { ConfigService } from '@nestjs/config';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import {
  EmailNotification,
  LocalNotification,
} from '../dto/notification-message.dto';
import { User } from 'src/modules/user/entities/user.entity';
import { OrderReceipt } from './order.receipt';
import { Order } from 'src/modules/order/entities/order.entity';
import { ShipmentStatus } from 'src/modules/order/dto/order.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { AppConfig } from 'src/modules/app-config/entities/app-config.entity';
import { IsNull, Not, Repository } from 'typeorm';

export interface NotificationGeneratorDto {
  userId?: string;
  channels: NotificationChannels[];
}
@Injectable()
export class NotificationGeneratorService {
  constructor(
    private configService: ConfigService,
    @InjectQueue(process.env.BULL_NOTIFICATION_QUEUE)
    private readonly notificationQueue: Queue,
    private orderReceipt: OrderReceipt,
    @InjectRepository(AppConfig)
    private appConfigRepository: Repository<AppConfig>,
  ) {}

  get preference() {
    return {
      supportEmail: this.configService.get<string>('app.supportEmail'),
      domain: this.configService.get<string>('app.domain'),
      appName: this.configService.get<string>('app.name'),
    };
  }

  /**
   * Sends a login notification email.
   * @param request - NotificationGeneratorDto containing necessary data.
   */
  sendLoginMail(request: NotificationGeneratorDto) {
    const mail: EmailNotification = {
      subject: `Login Notification from ${this.preference.appName}`,
      message: `<p>We noticed a new login to your ${this.preference.appName} account <br><br>
              <strong> ${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()} </strong>`,
      preference: this.preference,
    };
    const notification: NotificationDto = {
      message: { mail },
      ...request,
    };
    this.notificationQueue.add('notification', notification);
  }

  /**
   * Sends a verification email to the specified address.
   *
   * @param {NotificationGeneratorDto} request - DTO containing notification details.
   * @param {string} email - The recipient's email address.
   * @param {string} code - The verification code to include in the email.
   */
  async sendVerificationMail(
    request: NotificationGeneratorDto,
    email: string,
    code: string,
  ): Promise<void> {
    const mail: EmailNotification = {
      subject: `Email Verification from ${this.preference.appName}`,
      message: `<p>Welcome to ${this.preference.appName}</p>
      <p>We're thrilled to have you on board. To get started and enjoy all the features we offer, we'll need to verify your email address. <br><br>
      Please use the below code to gain access to your account <br><br>
      <h2><strong>${code}</strong></h2>`,
      preference: this.preference,
      emailAddress: email,
      fullName: 'sir/ma',
    };

    const notification: NotificationDto = {
      message: { mail },
      ...request,
    };

    this.notificationQueue.add('notification', notification);
  }

  /**
   * Sends a password recovery email.
   * @param request - NotificationGeneratorDto containing necessary data.
   * @param code - Recovery code to be included in the email.
   */
  async sendPasswordRecoveryMail(
    request: NotificationGeneratorDto,
    code: string,
  ) {
    const mail: EmailNotification = {
      subject: `Password recovery Notification from ${this.preference.appName}`,
      message: `<p>You asked to reset the password to your ${this.preference.appName} account. <br><br>
      Please use the below code to gain access to your account <br><br>
      <h2><strong>${code}</strong></h2>`,
      preference: this.preference,
    };
    const notification: NotificationDto = {
      message: { mail },
      ...request,
    };
    this.notificationQueue.add('notification', notification);
  }

  /**
   * Sends a password recovery success email.
   * @param request - NotificationGeneratorDto containing necessary data.
   * @param data - Object containing email and new password for the user.
   */
  async sendPasswordRecoverySuccessMail(
    request: NotificationGeneratorDto,
    data: { email: string; password: string },
  ) {
    const mail: EmailNotification = {
      subject: `Password Reset Notification from ${this.preference.appName}`,
      message: `<p>Password Reset!<br>Your account password was reset. Your login details are below: <br><br>
      <strong>Email: </strong> ${data.email} <br>
      <strong>Password: </strong> ${data.password} <br>`,
      action: 'Login',
      url: `${this.configService.get<string>('app.url')}dashboard`,
      preference: this.preference,
    };
    const notification: NotificationDto = {
      message: { mail },
      ...request,
    };
    this.notificationQueue.add('notification', notification);
  }

  async sendStaffWelcomeMail(user: User, password: string) {
    const mail: EmailNotification = {
      subject: `Welcome to the Team!`,
      message: `
      <p>We're thrilled to have you on board.</p>
      <p>Please use the below credentials to gain access to your account</p>
      <p><hr></p>
      <h5><strong>Email: </strong> ${user.email}</h5>
      <h5><strong>Password: </strong> ${password}</h5>
      <p><hr></p>`,
      preference: this.preference,
    };
    const notification: NotificationDto = {
      message: { mail },
      channels: [NotificationChannels.email],
      userId: user.id,
    };
    this.notificationQueue.add('notification', notification);
  }

  async broadcast(data: {
    subject: string;
    message: string;
    attachment: MessageAttachment;
    user: User;
    channel: any[];
  }) {
    const image = data.attachment
      ? `<img width="300" src="${data.attachment.url}" />`
      : '';
    const mail: EmailNotification = {
      subject: data.subject,
      message: `<p>${data.message}</p> <p> <strong></strong> ${image} </p>`,
      preference: this.preference,
    };

    const local: LocalNotification = {
      title: data.subject,
      message: data.message,
    };

    const notification: NotificationDto = {
      message: { mail, local },
      channels: data.channel,
      userId: data.user.id,
    };

    this.notificationQueue.add('notification', notification);
  }

  async notifyAdminNewOrder(order: Order) {
    const config = await this.appConfigRepository.findOneBy({
      id: Not(IsNull()),
    });
    const subject = 'New Order!';
    const info =
      'A new order has been creeated and requires processing, please log into the dashboard to view order';
    const message = this.orderReceipt.generateProcessing(info, order);
    for (const email of config.adminEmails) {
      const mail: EmailNotification = {
        subject,
        message,
        emailAddress: email,
        fullName: 'Admin',
        preference: this.preference,
      };
      const notification: NotificationDto = {
        message: { mail },
        channels: [NotificationChannels.email],
      };
      this.notificationQueue.add('notification', notification);
    }
  }

  async sendOrderUpdate(order: Order) {
    let info = '';
    let subject = '';

    switch (order.shipments[0].status) {
      case ShipmentStatus.processing:
        this.notifyAdminNewOrder(order);
        subject = 'Order Confirmation';
        info =
          'Thank you for shopping with us. Your order has been confirmed and is now being processed.';
        break;

      case ShipmentStatus.in_transit:
        subject = 'Order Shipped';
        info =
          'Your order is on the way! It has been shipped and is currently in transit to your address. We will notify you once it arrives.';
        break;

      case ShipmentStatus.canceled:
        subject = 'Order Canceled';
        info =
          'We regret to inform you that your order has been canceled. If you believe this was a mistake, please contact our support team.';
        break;

      case ShipmentStatus.delivered:
        subject = 'Order Delivered';
        info =
          'Great news! Your order has been successfully delivered. We hope you are enjoying your purchase. Thank you for choosing us!';
        break;

      default:
        subject = 'Order Status Update';
        info =
          'Your order status has been updated. Please check your account for more details.';
    }

    const mail: EmailNotification = {
      subject,
      message: this.orderReceipt.generateProcessing(info, order),
      preference: this.preference,
    };

    const local: LocalNotification = {
      title: subject,
      message: info,
    };

    const notification: NotificationDto = {
      message: { mail, local },
      channels: [NotificationChannels.email, NotificationChannels.local],
      userId: order.userId,
    };
    this.notificationQueue.add('notification', notification);
  }
}
