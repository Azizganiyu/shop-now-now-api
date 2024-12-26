import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateAddress, UpdateAddress } from './dto/address-create.dto';
import { Address } from './entities/address.entity';

@Injectable()
export class AddressService {
  constructor(
    @InjectRepository(Address)
    private readonly addressRepository: Repository<Address>,
  ) {}

  async findAll(userId: string) {
    return await this.addressRepository.findBy({ userId });
  }

  async findOne(id: string) {
    try {
      return await this.addressRepository.findOneByOrFail({
        id,
      });
    } catch (error) {
      throw new NotFoundException('Address not found');
    }
  }

  async create(address: CreateAddress, userId: string) {
    const exist = await this.addressRepository.findOneBy({ userId });
    if (exist) {
      return await this.update(exist.id, address);
    }
    const create = await this.addressRepository.create({
      userId,
      ...address,
    });
    return await this.addressRepository.save(create);
  }

  async update(id: string, address: UpdateAddress) {
    await this.addressRepository.update(id, { ...address });
    return await this.findOne(id);
  }

  async remove(id: string) {
    return await this.addressRepository.delete(id);
  }
}
