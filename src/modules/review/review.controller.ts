import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  HttpCode,
  Post,
  Query,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorator/roles.decorator';
import { ApiBearerAuth, ApiCreatedResponse, ApiTags } from '@nestjs/swagger';
import { ReviewService } from './review.service';
import { Userx } from 'src/decorator/userx.decorator';
import { User } from '../user/entities/user.entity';
import { CreateReviewDto } from './dto/create-review.dto';
import { ApiResponseDto } from '../misc/responses/api-response.dto';
import { PageOptionsDto } from 'src/utilities/pagination/dtos';
import { FindReviewsDto } from './dto/find-reviews.dto';
import { RoleTag } from 'src/constants/roletag';

@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('user', 'admin')
@ApiBearerAuth('JWT-auth')
@ApiTags('Reviews')
@UseInterceptors(ClassSerializerInterceptor)
@Controller('review')
export class ReviewController {
  constructor(private reviewService: ReviewService) {}

  @Roles('user')
  @ApiCreatedResponse({ status: 201, type: ApiResponseDto })
  @HttpCode(201)
  @Post()
  async review(@Userx() user: User, @Body() request: CreateReviewDto) {
    await this.reviewService.review(user, request);
    return {
      status: true,
      message: 'product reviewed successfully',
    };
  }

  @ApiCreatedResponse({ status: 200, type: ApiResponseDto })
  @HttpCode(200)
  @Get()
  async reviews(
    @Userx() user: User,
    @Query() filter: FindReviewsDto,
    @Query() pageOptionDto: PageOptionsDto,
  ) {
    if (user.role.tag == RoleTag.user) {
      filter.userId = user.id;
    }
    await this.reviewService.findAll(filter, pageOptionDto);
    return {
      status: true,
      message: 'product reviewed successfully',
    };
  }
}
