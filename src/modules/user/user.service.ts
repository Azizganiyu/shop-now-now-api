import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PageMetaDto } from 'src/utilities/pagination/page-meta.dto';
import { PageDto } from 'src/utilities/pagination/page.dto';
import { FindUserDto } from './dto/find-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Brackets, IsNull, Not, Repository } from 'typeorm';
import { PageOptionsDto } from 'src/utilities/pagination/dtos';
import { CreateUserDto } from '../auth/dto/create-user.dto';
import { CreateUserTransaction } from 'src/utilities/transactions/create-user-transaction';
import { RequestContextService } from 'src/utilities/request-context.service';
import { Activity } from '../activity/entities/activity.entity';
import { HelperService } from 'src/utilities/helper.service';
import { ActivityService } from '../activity/activity.service';
import { SessionService } from '../auth/session/session.service';
import { EmailDto } from '../auth/dto/email-verify.dto';
import { TempUser } from './entities/temp-user.entity';
import { NotificationGeneratorService } from '../notification/notification-generator/notification-generator.service';
import { VerifyDto } from '../auth/dto/verify.dto';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(TempUser)
    private tempUserRepository: Repository<TempUser>,
    private requestContext: RequestContextService,
    private createUserTransaction: CreateUserTransaction,
    private helperService: HelperService,
    private activityService: ActivityService,
    private sessionService: SessionService,
    private notificationGenerator: NotificationGeneratorService,
  ) {}

  /**
   * Register a new user.
   *
   * @param request - The data for creating the user.
   * @returns The newly created user.
   */
  async register(request: CreateUserDto): Promise<User> {
    // Copy request data to a new object
    const data = {
      ...request,
    };

    // Check if the email is already in use
    await this.checkEmail(request.email);

    //validate email
    if (request.roleId == 'user') {
      await this.validateTempUser({ email: request.email });
    }

    // Execute the transaction to create a new user
    return await this.createUserTransaction.run(data);
  }

  /**
   * Checks if the given email address already exists in the system.
   *
   * @param {string} email The email address to check.
   * @returns {Promise<void>} A promise that resolves if the email address is unique.
   * @throws {BadRequestException} Thrown if the email address already exists.
   */
  async checkEmail(email: string) {
    const userCount = await this.userRepository.count({
      where: {
        email,
        isDeleted: false,
      },
    });
    if (userCount > 0) {
      throw new BadRequestException('Email already exists');
    }
  }

  /**
   * Find users based on provided filtering options and pagination parameters.
   *
   * @param pageOptionsDto - The pagination options.
   * @param filter - The filtering options.
   * @returns A page of users that match the filtering and pagination criteria.
   */
  async find(pageOptionsDto: PageOptionsDto, filter: FindUserDto) {
    const users = this.userRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.role', 'role')
      .where(`user.isDeleted = :deleted`, {
        deleted: false,
      })
      .andWhere(filter.status ? `user.status = :status` : '1=1', {
        status: filter.status,
      })
      .andWhere(filter.admin ? `role.tag = :role` : '1=1', {
        role: 'admin',
      })
      .andWhere(!filter.admin ? `role.tag = :role` : '1=1', {
        role: 'user',
      })
      .andWhere(filter.from ? `user.createdAt >= :fromDate` : '1=1', {
        fromDate: filter.from,
      })
      .andWhere(filter.to ? `user.createdAt <= :toDate` : '1=1', {
        toDate: filter.to,
      })
      .andWhere(
        filter.search
          ? new Brackets((qb) => {
              qb.where('user.firstName like :firstName', {
                firstName: '%' + filter.search + '%',
              })
                .orWhere('user.lastName like :lastName', {
                  lastName: '%' + filter.search + '%',
                })
                .orWhere('user.email like :email', {
                  email: '%' + filter.search + '%',
                })
                .orWhere('user.phone like :phone', {
                  phone: '%' + filter.search + '%',
                });
            })
          : '1=1',
      )
      .orderBy('user.createdAt', pageOptionsDto.order)
      .skip(pageOptionsDto.skip)
      .take(pageOptionsDto.take);
    const itemCount = await users.getCount();
    const { entities } = await users.getRawAndEntities();
    const pageMetaDto = new PageMetaDto({ itemCount, pageOptionsDto });
    return new PageDto(entities, pageMetaDto);
  }

  /**
   * Find a user by their ID.
   *
   * @param id - The ID of the user to find.
   * @returns The found user.
   * @throws NotFoundException if no user with the provided ID is found.
   */
  async findOne(id: string) {
    try {
      return await this.userRepository.findOneOrFail({
        where: { id },
        relations: ['role'],
      });
    } catch (error) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
  }

  /**
   * Suspend a user account.
   *
   * @param id - The ID of the user to suspend.
   * @param reason - The reason for suspending the user's account.
   * @throws NotFoundException if the user with the provided ID is not found.
   */
  async suspend(id: string, reason: string) {
    const user = await this.findOne(id);
    await this.userRepository.update(
      {
        id,
      },
      { status: 'suspended' },
    );
    const activity: Activity = {
      event: 'user suspended',
      description: `${this.helperService.getFullName(user)} suspended at ${new Date().toISOString()}. ${reason}`,
      ipAddress: this.requestContext.ip,
      userId: user.id,
      object: 'user',
      objectId: user.id,
    };
    this.activityService.create(activity);
  }

  /**
   * Unsuspend a user account.
   *
   * @param id - The ID of the user to unsuspend.
   * @param reason - The reason for unsuspending the user's account.
   * @throws NotFoundException if the user with the provided ID is not found.
   */
  async unsuspend(id: string, reason: string) {
    const user = await this.findOne(id);
    await this.userRepository.update(
      {
        id,
      },
      { status: 'active' },
    );
    const activity: Activity = {
      event: 'user unsuspended',
      description: `${this.helperService.getFullName(user)} unsuspended at ${new Date().toISOString()}. ${reason}`,
      ipAddress: this.requestContext.ip,
      userId: user.id,
      object: 'user',
      objectId: user.id,
    };
    this.activityService.create(activity);
  }

  /**
   * Delete a user's account.
   *
   * @param user - The user whose account will be deleted.
   * @param email - The email address provided for verification.
   * @throws BadRequestException if the provided email does not match the user's email.
   */
  async deleteAccount(user: User, email: string) {
    if (user.email != email) {
      throw new BadRequestException('Email provided does not match user email');
    }
    // Delete the user's account
    await this.userRepository.update(user.id, { isDeleted: true });
    // Delete the user's current session
    await this.sessionService.deleteCurrentSession();
  }

  /**
   * Creates a temporary user, sends a verification email, and stores the user data.
   *
   * @param {EmailDto} request - DTO containing the email address.
   * @returns {Promise<void>}
   */
  async createTempUser(request: EmailDto): Promise<void> {
    await this.checkEmail(request.email);
    await this.tempUserRepository.delete({ email: request.email });

    const create = this.tempUserRepository.create({
      email: request.email,
      code: await this.helperService.encrypt(this.helperService.generateCode()),
      tokenExpireAt: this.helperService.setDateFuture(3600),
    });

    const temp = await this.tempUserRepository.save(create);

    await this.notificationGenerator.sendVerificationMail(
      { channels: ['email'] },
      temp.email,
      await this.helperService.decrypt(temp.code),
    );
  }

  /**
   * Verifies a temporary user by checking the provided code and updating the user data.
   *
   * @param {VerifyDto} request - DTO containing the email and verification code.
   * @throws {BadRequestException} If the code is invalid or expired.
   */
  async verifyTempUser(request: VerifyDto) {
    const user = await this.tempUserRepository.findOne({
      where: {
        email: request.email,
        code: await this.helperService.encrypt(request.code),
      },
    });

    if (!user) {
      throw new BadRequestException('Invalid code, user not found');
    }

    const expired = this.helperService.checkExpired(user.tokenExpireAt);
    if (expired) {
      throw new BadRequestException('Code has expired');
    }

    return await this.tempUserRepository.update(user.id, {
      verifiedAt: new Date(),
      verificationExpireAt: this.helperService.setDateFuture(3600),
    });
  }

  /**
   * Validates a temporary user by checking if the user is verified and deleting the user if valid.
   *
   * @param {EmailDto} request - DTO containing the email address.
   * @throws {BadRequestException} If the user is not verified or verification has expired.
   */
  async validateTempUser(request: EmailDto) {
    const user = await this.tempUserRepository.findOne({
      where: {
        email: request.email,
        verifiedAt: Not(IsNull()),
      },
    });

    if (!user) {
      throw new BadRequestException(
        'Error registering user, user is not verified',
      );
    }

    const expired = this.helperService.checkExpired(user.verificationExpireAt);
    if (expired) {
      throw new BadRequestException('Verification has expired');
    }

    return await this.tempUserRepository.delete(user.id);
  }

  async update(id: string, data: QueryDeepPartialEntity<User>) {
    await this.userRepository.update(id, data);
    return await this.findOne(id);
  }
}
