import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Patch,
  Query,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorator/roles.decorator';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { UserService } from './user.service';
import { Userx } from 'src/decorator/userx.decorator';
import { User } from './entities/user.entity';
import { EmailDto } from '../auth/dto/email-verify.dto';
import { FindUserDto } from './dto/find-user.dto';
import { PageOptionsDto } from 'src/utilities/pagination/dtos';
import { IdDto } from '../misc/dto/id-dto.dto';
import { ReasonDto } from './dto/reason.dto';
import { GetUserResponseDto } from './responses/user-response.dto';
import { ApiResponseDto } from '../misc/responses/api-response.dto';
import { UserFindResponseDto } from './responses/find-user-response.dto';
import { UpdateUserDto } from '../auth/dto/create-user.dto';

@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('user', 'admin')
@ApiBearerAuth('JWT-auth')
@UseInterceptors(ClassSerializerInterceptor)
@ApiTags('User')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  /**
   * Retrieve authenticated user information.
   *
   * @param user - The authenticated user.
   * @returns The authenticated user's information.
   */
  @ApiOkResponse({ status: 200, type: GetUserResponseDto })
  @HttpCode(200)
  @Get()
  async get(@Userx() user: User) {
    const data = await this.userService.findOne(user.id);
    return {
      status: true,
      message: 'Authenticated user successfully retrieved',
      data: data,
    };
  }

  /**
   * Delete the user's account.
   *
   * @param user - The authenticated user.
   * @param request - The email address provided for verification.
   * @throws BadRequestException if the provided email does not match the user's email.
   */
  @Roles('user')
  @ApiOkResponse({ status: 200, type: ApiResponseDto })
  @HttpCode(200)
  @Delete('account/delete')
  async deleteAccount(@Userx() user: User, @Body() request: EmailDto) {
    await this.userService.deleteAccount(user, request.email);
    return {
      status: true,
      message: 'Account successfully deleted',
    };
  }

  /**
   * Retrieves a list of users based on provided page options and filter criteria.
   * @param pageOptionDto Pagination options such as limit and page number.
   * @param filter Filtering criteria for user search.
   * @returns An object with status, message, and retrieved user data.
   */
  @ApiOkResponse({ status: 200, type: UserFindResponseDto })
  @HttpCode(200)
  @Get('find')
  async findAll(
    @Query() pageOptionDto: PageOptionsDto,
    @Query() filter: FindUserDto,
  ) {
    // Fetch user data based on the provided page options and filter
    const data = await this.userService.find(pageOptionDto, filter);

    // Return a response with status, message, and the retrieved data
    return {
      status: true,
      message: 'Users successfully retrieved',
      data: data,
    };
  }

  /**
   * Retrieves a specific user based on the provided user ID.
   * @param param Object containing the user ID from the route parameter.
   * @returns An object with status, message, and retrieved user data.
   */
  @ApiOkResponse({ status: 200, type: GetUserResponseDto })
  @Roles('admin')
  @HttpCode(200)
  @Get(':id')
  async findOne(@Param() param: IdDto) {
    // Fetch a specific user based on the provided user ID
    const data = await this.userService.findOne(param.id);

    // Return a response with status, message, and the retrieved data
    return {
      status: true,
      message: 'User successfully retrieved',
      data: data,
    };
  }

  /**
   * Suspends a user based on the provided user ID and reason.
   * @param param Object containing the user ID from the route parameter.
   * @param request Object containing the reason for suspending the user.
   * @returns An object with status and a success message.
   */
  @ApiOkResponse({ status: 200, type: ApiResponseDto })
  @Roles('admin')
  @HttpCode(200)
  @ApiParam({ name: 'id', description: 'user ID' })
  @Patch(':id/suspend')
  async suspend(@Param() param: IdDto, @Body() request: ReasonDto) {
    // Suspend a user based on the provided user ID and reason
    await this.userService.suspend(param.id, request.reason);

    // Return a response with status and a success message
    return {
      status: true,
      message: 'User successfully suspended',
    };
  }

  /**
   * Unsuspends a user based on the provided user ID and reason.
   * @param param Object containing the user ID from the route parameter.
   * @param request Object containing the reason for unsuspending the user.
   * @returns An object with status and a success message.
   */
  @ApiOkResponse({ status: 200, type: ApiResponseDto })
  @HttpCode(200)
  @Roles('admin')
  @ApiParam({ name: 'id', description: 'user ID' })
  @Patch(':id/unsuspend')
  async unsuspend(@Param() param: IdDto, @Body() request: ReasonDto) {
    // Unsuspend a user based on the provided user ID and reason
    await this.userService.unsuspend(param.id, request.reason);

    // Return a response with status and a success message
    return {
      status: true,
      message: 'User successfully unsuspended',
    };
  }

  /**
   * Deletes a user account based on the provided user ID.
   * @param param Object containing the user ID from the route parameter.
   * @returns An object with status and a success message.
   */
  @ApiOkResponse({ status: 200, type: ApiResponseDto })
  @HttpCode(200)
  @Roles('admin')
  @ApiParam({ name: 'id', description: 'user ID' })
  @Delete(':id/delete')
  async delete(@Param() param: IdDto) {
    const user = await this.userService.findOne(param.id);
    await this.userService.deleteAccount(user, user.email);
    return {
      status: true,
      message: 'Account successfully deleted',
    };
  }

  @ApiOkResponse({ status: 200, type: ApiResponseDto })
  @Roles('*')
  @HttpCode(200)
  @ApiParam({ name: 'id', description: 'user ID' })
  @Patch(':id/update')
  async update(@Param() param: IdDto, @Body() request: UpdateUserDto) {
    // Suspend a user based on the provided user ID and reason
    await this.userService.update(param.id, request);

    // Return a response with status and a success message
    return {
      status: true,
      message: 'User successfully updated',
    };
  }
}
