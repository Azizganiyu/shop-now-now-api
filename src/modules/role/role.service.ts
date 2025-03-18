import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Not, Repository } from 'typeorm';
import { Role } from './entities/role.entity';

@Injectable()
export class RoleService {
  constructor(
    @InjectRepository(Role) private roleRepository: Repository<Role>,
  ) {}

  /**
   * Finds a role by its ID.
   *
   * @param {string} id The ID of the role to find.
   * @returns {Promise<Role>} A promise that resolves with the role if found.
   * @throws {NotFoundException} Thrown if the role with the specified ID is not found.
   */
  async findOne(id: string) {
    try {
      return await this.roleRepository.findOneOrFail({ where: { id } });
    } catch (error) {
      console.log(error);
      throw new NotFoundException('Unable to find role');
    }
  }

  async find(tag: string) {
    return await this.roleRepository.findBy({ tag: tag ?? Not(IsNull()) });
  }
}
