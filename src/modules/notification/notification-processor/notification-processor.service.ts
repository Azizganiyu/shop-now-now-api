import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';
import { NotificationService } from '../notification.service';

@Processor(process.env.BULL_NOTIFICATION_QUEUE)
export class NotificationProcessorService {
  constructor(private notificationService: NotificationService) {}

  /**
   * Processes a notification job.
   *
   * @param {Job} job The notification job to process.
   * @returns {Promise<void>} A promise that resolves when the notification job is processed.
   */
  @Process('notification')
  async sendNotification(job: Job) {
    await this.notificationService.send(job.data);
  }
}
