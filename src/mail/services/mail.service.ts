import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { EmailNotification } from 'src/modules/notification/dto/notification-message.dto';

@Injectable()
export class MailService {
  constructor(private mailerService: MailerService) {}

  /**
   * Sends an email notification using the MailerService.
   *
   * @param {EmailNotification} data - The data object containing email details.
   * @returns {boolean} Returns true if the email was sent successfully, otherwise false.
   */
  async sendMail(data: EmailNotification): Promise<boolean> {
    try {
      await this.mailerService.sendMail({
        to: data.emailAddress,
        subject: data.subject,
        template: './mail_template',
        attachments: data.attachments ?? null,
        context: {
          name: data.fullName,
          message: data.message,
          url: data.url,
          preference: data.preference,
          action: data.action,
          email: data.emailAddress,
          date: new Date().toLocaleDateString(),
          time: new Date().toLocaleTimeString(),
        },
      });
      return true;
    } catch (error) {
      console.log(error);
      return false;
    }
  }
}
