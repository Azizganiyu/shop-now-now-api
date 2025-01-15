import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Ssions } from '../entities/ssions.entity';
import { RequestContextService } from 'src/utilities/request-context.service';
import { DeviceDetectorResult } from 'device-detector-js';
import { PageMetaDto } from 'src/utilities/pagination/page-meta.dto';
import { PageDto } from 'src/utilities/pagination/page.dto';
import { PageOptionsDto } from 'src/utilities/pagination/dtos';

@Injectable()
export class SessionService {
  constructor(
    @InjectRepository(Ssions)
    private sessionRepository: Repository<Ssions>,
    private requestContext: RequestContextService,
  ) {}

  /**
   * Validates the session by checking if it exists, is active, and has not expired.
   * If the session is expired, it updates the session status and throws an UnauthorizedException.
   * If the session is valid, it extends the session expiration time by one hour.
   *
   * @returns {Promise<void>} A promise that resolves once the session validation process is completed.
   * @throws {UnauthorizedException} Thrown if the session is expired or invalid.
   */
  async validateSession() {
    const now = new Date();
    const session = await this.sessionRepository.findOne({
      where: {
        token: this.requestContext.token,
      },
    });
    if (!session || session.expiresAt < now || !session.status) {
      if (session && session.expiresAt < now && session.status) {
        await this.sessionRepository.update(session.id, {
          status: false,
        });
      }
      throw new UnauthorizedException('Session expired');
    } else {
      now.setDate(now.getDate() + 3);
      return await this.sessionRepository.update(session.id, {
        expiresAt: now,
      });
    }
  }

  /**
   * Saves a new session.
   *
   * @function save
   * @param {string} userId - The ID of the user associated with the session.
   * @param {string} token - The session token.
   * @param {DeviceDetectorResult} device - The device information.
   * @returns {Promise<Session>} A promise resolving to the saved session data.
   */
  async save(userId: string, token: string, device: DeviceDetectorResult) {
    const now = new Date();
    now.setDate(now.getDate() + 3);
    const data: Ssions = {
      token,
      clientName: device.client?.name ?? '',
      clientType: device.client?.type ?? '',
      clientVersion: device.client?.version ?? '',
      osName: device.os?.name ?? '',
      osVersion: device.os?.version ?? '',
      deviceType: device.device?.type ?? '',
      deviceBrand: device.device?.brand ?? '',
      expiresAt: now,
      userId,
    };
    return await this.sessionRepository.save(data);
  }

  /**
   * Replaces the current session token with a new token.
   *
   * @param {string} token The new token to replace the current one.
   * @returns {Promise<void>} A promise that resolves once the token replacement is completed.
   */
  async replaceToken(token: string) {
    return await this.sessionRepository.update(
      { token: this.requestContext.token },
      { token },
    );
  }

  /**
   * Retrieves user sessions based on merchant and user IDs.
   *
   * @function getUserSessions
   * @param {string} userId - The ID of the user.
   * @param {PageOptionsDto} pageOptionsDto - The pagination options.
   * @returns {Promise<Object>} A promise resolving to an object containing user sessions.
   */
  async getUserSessions(userId: string, pageOptionsDto: PageOptionsDto) {
    const now = new Date();
    const sessions = this.sessionRepository
      .createQueryBuilder('sessions')
      .andWhere(userId ? 'sessions.userId = :userId' : '1=1', {
        userId,
      })
      .andWhere('sessions.status = :status', { status: true })
      .andWhere('sessions.expiresAt > :now', { now });
    const itemCount = await sessions.getCount();
    const { entities } = await sessions.getRawAndEntities();
    const pageMetaDto = new PageMetaDto({ itemCount, pageOptionsDto });
    return {
      currentSessionId: (await this.findOneByToken()).id,
      ...new PageDto(entities, pageMetaDto),
    };
  }

  /**
   * Marks the current session as inactive by updating its status to false in the session repository.
   *
   * @returns {Promise<void>} A promise that resolves once the current session is marked as inactive.
   */
  async deleteCurrentSession() {
    return await this.sessionRepository.update(
      {
        token: this.requestContext.token,
      },
      { status: false },
    );
  }

  async deleteUserSession(userId: string) {
    return await this.sessionRepository.update(
      {
        userId,
      },
      { status: false },
    );
  }

  /**
   * Marks the session with the specified ID as inactive by updating its status to false in the session repository.
   *
   * @param {string} id The ID of the session to delete.
   * @returns {Promise<void>} A promise that resolves once the session is marked as inactive.
   */
  async delete(id: string) {
    return await this.sessionRepository.update(id, { status: false });
  }

  /**
   * Updates the expiration time of the current session and marks it as active.
   *
   * @returns {Promise<void>} A promise that resolves once the current session is updated.
   */
  async updateCurrentSession() {
    const now = new Date();
    now.setHours(now.getHours() + 1);
    return await this.sessionRepository.update(
      { token: this.requestContext.token },
      { expiresAt: now, status: true },
    );
  }

  /**
   * Updates the session with the specified ID, extending its expiration time by one hour and marking it as active.
   *
   * @param {string} id The ID of the session to update.
   * @returns {Promise<void>} A promise that resolves once the session is updated.
   */
  async update(id: string) {
    const now = new Date();
    now.setHours(now.getHours() + 1);
    return await this.sessionRepository.update(id, {
      expiresAt: now,
      status: true,
    });
  }

  /**
   * Finds a session by its token.
   *
   * @function findOneByToken
   * @returns {Promise<Ssions>} A promise resolving to the session found by its token.
   */
  async findOneByToken() {
    return await this.sessionRepository.findOneBy({
      token: this.requestContext.token,
    });
  }
}
