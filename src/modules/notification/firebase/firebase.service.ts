import { Injectable } from '@nestjs/common';
import * as admin from 'firebase-admin';
import { DeviceToken } from 'src/modules/misc/entities/device-tokens.entity';

@Injectable()
export class FirebaseService {
  private readonly firebaseApp: admin.app.App;

  constructor() {
    this.firebaseApp = admin.initializeApp(
      {
        credential: admin.credential.cert('src/configs/firebase-admin.json'),
      },
      'notification',
    );
  }

  async sendNotification(
    tokens: DeviceToken[],
    title: string,
    body: string,
    imageUrl: string = null,
  ): Promise<boolean> {
    console.log('sending push', tokens.map((token) => token.token)[0]);
    try {
      const notification =
        imageUrl && imageUrl?.length > 0
          ? {
              title,
              body,
              imageUrl: imageUrl ?? '',
            }
          : {
              title,
              body,
            };
      const message: admin.messaging.Message = {
        notification,
        token: tokens.map((token) => token.token)[0],
      };
      await this.firebaseApp.messaging().send(message);
      return true;
    } catch (error) {
      console.log(error);
      return false;
    }
  }
}
