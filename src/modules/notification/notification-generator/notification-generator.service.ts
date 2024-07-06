import { Injectable } from '@nestjs/common';
import { NotificationDto } from '../dto/notification.dto';
import { ConfigService } from '@nestjs/config';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { EmailNotification } from '../dto/notification-message.dto';

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
   * Sends an email verification email.
   * @param request - NotificationGeneratorDto containing necessary data.
   * @param code - Verification code to be included in the email.
   */
  async sendVerificationMail(request: NotificationGeneratorDto, code: string) {
    const mail: EmailNotification = {
      subject: `Email Verification from ${this.preference.appName}`,
      message: `<p> Welcome to ${this.preference.appName}</p> 
    <p>We're thrilled to have you on board. To get started and enjoy all the features we offer, we'll need to verify your email address. <br><br>
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
}
