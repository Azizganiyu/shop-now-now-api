import { Injectable } from '@nestjs/common';
import { MessageAttachment, NotificationDto } from '../dto/notification.dto';
import { ConfigService } from '@nestjs/config';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { EmailNotification } from '../dto/notification-message.dto';
import { User } from 'src/modules/user/entities/user.entity';

export interface NotificationGeneratorDto {
  userId?: string;
  channels: string[];
}
@Injectable()
export class NotificationGeneratorService {
  constructor(
    private configService: ConfigService,
    @InjectQueue(process.env.BULL_NOTIFICATION_QUEUE)
    private readonly notificationQueue: Queue,
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
      channels: ['email'],
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
      ? `<span>${data.attachment.name} | ${data.attachment.size / 1000000}mb</span> <br/> <img width="300" src="${data.attachment.url}" />`
      : '';
    const mail: EmailNotification = {
      subject: data.subject,
      message: `<p>${data.message}</p> <p> <strong></strong> ${image} </p>`,
      preference: this.preference,
    };
    const notification: NotificationDto = {
      message: { mail },
      channels: data.channel,
      userId: data.user.id,
    };

    console.log(notification);
    this.notificationQueue.add('notification', notification);
  }
}
