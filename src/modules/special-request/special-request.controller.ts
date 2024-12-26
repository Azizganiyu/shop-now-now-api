import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  HttpCode,
  Post,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Roles } from '../auth/decorator/roles.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { SpecialRequestService } from './special-request.service';
import { ApiResponseDto } from '../misc/responses/api-response.dto';
import { User } from '../user/entities/user.entity';
import { Userx } from 'src/decorator/userx.decorator';
import { SpecialRequestDto } from './dto/special-request.dto';

@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('user', 'admin')
@ApiBearerAuth('JWT-auth')
@ApiTags('Special Request')
@Controller('special-request')
@UseInterceptors(ClassSerializerInterceptor)
export class SpecialRequestController {
  constructor(private specialRequestService: SpecialRequestService) {}

  @ApiResponse({ status: 201, type: ApiResponseDto })
  @HttpCode(201)
  @Post()
  async changePassword(
    @Userx() user: User,
    @Body() request: SpecialRequestDto,
  ) {
    await this.specialRequestService.create(request, user);
    return {
      status: true,
      message: 'request processed successfully',
    };
  }
}
