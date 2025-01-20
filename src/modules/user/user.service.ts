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
import { NotificationGeneratorService } from '../notification/notification-generator/notification-generator.service';
import { VerifyDto } from '../auth/dto/verify.dto';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';
import { UserRole } from './dto/user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
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

    // Execute the transaction to create a new user
    const user = await this.createUserTransaction.run(data);

    if (user.roleId === UserRole.user) {
      await this.sendVerificationMail(user);
    }

    return user;
  }

  async sendVerificationMail(user: User) {
    const code = this.helperService.generateCode();
    await this.userRepository.update(user.id, {
      code: await this.helperService.encrypt(code),
      tokenExpireAt: this.helperService.setDateFuture(3600),
    });
    this.notificationGenerator.sendVerificationMail(
      { channels: ['email'] },
      user.email,
      code,
    );
  }

  /**
   * Checks if the given email address already exists in the system.
   *
   * @param {string} email The email address to check.
   * @returns {Promise<void>} A promise that resolves if the email address is unique.
   * @throws {BadRequestException} Thrown if the email address already exists.
   */
  async checkEmail(email: string, id: string = null) {
    const userCount = await this.userRepository.count({
      where: {
        email,
        id: id ? Not(id) : Not(IsNull()),
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
      .andWhere(filter.status ? `user.status = :status` : '1=1', {
        status: filter.status,
      })
      .andWhere(filter.admin ? `role.tag = :admin` : '1=1', {
        admin: 'admin',
      })
      .andWhere(!filter.admin ? `role.tag = :user` : '1=1', {
        user: 'user',
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

  async findOneByEmail(email: string) {
    try {
      return await this.userRepository.findOneOrFail({
        where: { email },
        relations: ['role'],
      });
    } catch (error) {
      throw new NotFoundException(`User with email ${email} not found`);
    }
  }

  /**
   * Suspend a user account.
   *
   * @param id - The ID of the user to suspend.
   * @param reason - The reason for suspending the user's account.
   * @throws NotFoundException if the user with the provided ID is not found.
   */
  async suspend(id: string) {
    const user = await this.findOne(id);
    await this.userRepository.update(
      {
        id,
      },
      { status: 'suspended' },
    );
    const activity: Activity = {
      event: 'user suspended',
      description: `${this.helperService.getFullName(user)} suspended at ${new Date().toISOString()}`,
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
  async unsuspend(id: string) {
    const user = await this.findOne(id);
    await this.userRepository.update(
      {
        id,
      },
      { status: 'active' },
    );
    const activity: Activity = {
      event: 'user unsuspended',
      description: `${this.helperService.getFullName(user)} unsuspended at ${new Date().toISOString()}`,
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
    await this.userRepository.softDelete(user.id);
    // Delete the user's current session
    await this.sessionService.deleteUserSession(user.id);
  }

  /**
   * Verifies a temporary user by checking the provided code and updating the user data.
   *
   * @param {VerifyDto} request - DTO containing the email and verification code.
   * @throws {BadRequestException} If the code is invalid or expired.
   */
  async verifyUserEmail(request: VerifyDto) {
    const user = await this.userRepository.findOne({
      where: {
        email: request.email,
        code: await this.helperService.encrypt(request.code),
      },
    });

    if (!user) {
      throw new BadRequestException('Invalid code');
    }

    const expired = this.helperService.checkExpired(user.tokenExpireAt);
    if (expired) {
      throw new BadRequestException('Code has expired');
    }

    return await this.userRepository.update(user.id, {
      emailVerifiedAt: new Date(),
    });
  }

  async update(id: string, data: QueryDeepPartialEntity<User>) {
    await this.userRepository.update(id, data);
    return await this.findOne(id);
  }

  async summary() {
    return {
      totalUsers: await this.userRepository.countBy({ roleId: UserRole.user }),
      activeUsers: await this.userRepository.countBy({
        roleId: UserRole.user,
        status: 'active',
      }),
    };
  }
}
