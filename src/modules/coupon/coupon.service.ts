import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Coupon } from './entities/coupon.entity';
import { CreateCouponDto } from './dto/coupon.dto';

@Injectable()
export class CouponService {
  constructor(
    @InjectRepository(Coupon)
    private couponRepository: Repository<Coupon>,
  ) {}

  async createRequest(createDto: CreateCouponDto): Promise<Coupon> {
    const exist = await this.couponRepository.findOneBy({
      code: createDto.code,
    });
    if (exist) {
      throw new BadRequestException('coupon already exist');
    }
    const request = this.couponRepository.create(createDto);
    return await this.couponRepository.save(request);
  }

  async findAll(includeInactive: any) {
    return includeInactive
      ? await this.couponRepository.find({ order: { createdAt: 'DESC' } })
      : await this.couponRepository.find({
          where: { status: true },
          order: { createdAt: 'DESC' },
        });
  }

  async findOne(id: string): Promise<Coupon> {
    return await this.couponRepository.findOneBy({ id });
  }

  async findCoupon(code: string): Promise<Coupon> {
    const coupon = await this.couponRepository.findOneBy({ code });
    if (!coupon) {
      throw new BadRequestException('Invalid coupon code');
    }
    const now = new Date();
    const xendDate = new Date(coupon.endDate);
    const xstartDate = new Date(coupon.startDate);
    if (!coupon.status) {
      throw new BadRequestException('Invalid coupon');
    } else if (now.getTime() > xendDate.getTime()) {
      throw new BadRequestException('Coupon has expired');
    } else if (now.getTime() < xstartDate.getTime()) {
      throw new BadRequestException('Coupon not available yet');
    }
    return coupon;
  }

  async update(id: string, coupon: CreateCouponDto) {
    await this.couponRepository.update(id, coupon);
    return await this.findOne(id);
  }

  async activate(id: string) {
    return await this.couponRepository.update(id, { status: true });
  }

  async deactivate(id: string) {
    return await this.couponRepository.update(id, { status: false });
  }

  async remove(id: string) {
    return await this.couponRepository.delete(id);
  }
}
