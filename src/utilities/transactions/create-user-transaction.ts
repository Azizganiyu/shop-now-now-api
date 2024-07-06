import { Injectable } from '@nestjs/common';
import { DataSource, EntityManager } from 'typeorm';
import { BaseTransaction } from './base-transaction';
import * as bcrypt from 'bcrypt';
import { ConfigService } from '@nestjs/config';
import { HelperService } from '../helper.service';
import { Activity } from 'src/modules/activity/entities/activity.entity';
import { NotificationGeneratorService } from 'src/modules/notification/notification-generator/notification-generator.service';
import { CreateUserDto } from 'src/modules/auth/dto/create-user.dto';
import { User } from 'src/modules/user/entities/user.entity';

@Injectable()
export class CreateUserTransaction extends BaseTransaction<
  CreateUserDto,
  User
> {
  constructor(
    dataSource: DataSource,
    private configService: ConfigService,
    private helperService: HelperService,
    private notificationGenerator: NotificationGeneratorService,
  ) {
    super(dataSource);
  }

  protected async execute(
    data: CreateUserDto,
    manager: EntityManager,
  ): Promise<User> {
    /**
     * Executes the creation of a new user.
     *
     * This method takes user data, hashes the password, generates a username,
     * sets default values for avatar and token expiration, saves the user to
     * the database using the provided entity manager, creates a corresponding
     * signup activity, and sends a verification email.
     *
     * @param data - The data for creating the user.
     * @param manager - The entity manager to use for database operations.
     * @returns The created User entity.
     */
    const username =
      data.firstName && data.lastName
        ? data.firstName?.trim().replace(/\s+/g, '_') +
          '_' +
          data.lastName?.trim().replace(/\s+/g, '_') +
          '_' +
          this.helperService.generateRandomString()
        : null;

    // Prepare user object with hashed password and other default values
    const user: User = {
      ...data,
      username,
      avatar:
        this.configService.get<string>('app.serverUrl') +
        this.configService.get<string>('app.defaultAvatar'),
      password: await bcrypt.hash(data.password, 10),
      phone: data.phone ?? null,
      roleId: data.roleId,
      code: await this.helperService.encrypt(this.helperService.generateCode()),
      tokenExpireAt: this.helperService.setDateFuture(3600),
    };

    // Save the user entity to the database
    const createdUser = await manager.save(User, user);

    // Create activity record for signup event
    const activity: Activity = {
      event: 'Signup',
      description: `${this.helperService.getFullName(
        createdUser,
      )} Signed up at ${new Date().toISOString()}`,
      userId: createdUser.id,
      object: 'user',
      objectId: createdUser.id,
    };
    await manager.save(Activity, activity);

    // Send verification email to the user
    await this.notificationGenerator.sendVerificationMail(
      { userId: createdUser.id, channels: ['email'] },
      await this.helperService.decrypt(createdUser.code),
    );

    return createdUser;
  }
}
