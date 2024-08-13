import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateReviewDto } from './dto/create-review.dto';
import { OrderService } from '../order/order.service';
import { User } from '../user/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { ProductReview } from './entities/review.entity';
import { Repository } from 'typeorm';
import { FindReviewsDto } from './dto/find-reviews.dto';
import { PageOptionsDto } from 'src/utilities/pagination/dtos';
import { PageMetaDto } from 'src/utilities/pagination/page-meta.dto';
import { PageDto } from 'src/utilities/pagination/page.dto';

@Injectable()
export class ReviewService {
  constructor(
    private orderService: OrderService,
    @InjectRepository(ProductReview)
    private readonly reviewRepository: Repository<ProductReview>,
  ) {}

  async review(user: User, request: CreateReviewDto) {
    const hasOrdered = await this.orderService.userHasOrdered(
      user.id,
      request.productId,
    );
    if (!hasOrdered) {
      throw new BadRequestException('user has not ordered this product yet');
    }
    const create = this.reviewRepository.create({
      productId: request.productId,
      userId: user.id,
      rating: request.rating,
      comment: request.comment,
    });
    return await this.reviewRepository.save(create);
  }

  async findAll(filter: FindReviewsDto, pageOptionsDto: PageOptionsDto) {
    const reviews = this.reviewRepository
      .createQueryBuilder('review')
      .andWhere(filter.userId ? `review.userId = :userId` : '1=1', {
        userId: filter.userId,
      })
      .andWhere(filter.productId ? `review.productId = :productId` : '1=1', {
        productId: filter.productId,
      })
      .orderBy('review.createdAt', pageOptionsDto.order);

    const itemCount = await reviews.getCount();
    const { entities } = await reviews.getRawAndEntities();
    const pageMetaDto = new PageMetaDto({ itemCount, pageOptionsDto });
    return new PageDto(entities, pageMetaDto);
  }
}
