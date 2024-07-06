import {
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Query,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { Roles } from '../decorator/roles.decorator';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { RolesGuard } from '../guards/roles.guard';
import { SessionService } from './session.service';
import { PageOptionsDto } from 'src/utilities/pagination/dtos';
import { Userx } from 'src/decorator/userx.decorator';
import { User } from 'src/modules/user/entities/user.entity';
import { ApiResponseDto } from 'src/modules/misc/responses/api-response.dto';
import { SessionResponseDto } from '../responses/find-session-response.dto';

@ApiBearerAuth('JWT-auth')
@UseInterceptors(ClassSerializerInterceptor)
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('*')
@ApiTags('Sessions')
@Controller('sessions')
export class SessionController {
  constructor(private _session: SessionService) {}

  /**
   * Retrieves sessions for a user.
   *
   * @function getSession
   * @param {User} user - The user object.
   * @param {PageOptionsDto} pageOptionsDto - The pagination options.
   * @returns {Promise<Object>} A promise resolving to an object containing sessions data.
   */
  @ApiOkResponse({ status: 200, type: SessionResponseDto })
  @HttpCode(200)
  @Get()
  async getSession(
    @Userx() user: User,
    @Query() pageOptionsDto: PageOptionsDto,
  ) {
    const sessions = await this._session.getUserSessions(
      user.id,
      pageOptionsDto,
    );
    return {
      status: true,
      message: 'Sessions successfully retrieved',
      data: sessions,
    };
  }

  /**
   * Deletes a session by its ID.
   *
   * @function delete
   * @param {string} id - The ID of the session to delete.
   * @returns {Promise<Object>} A promise indicating the success of the deletion operation.
   */
  @ApiOkResponse({ status: 200, type: ApiResponseDto })
  @HttpCode(200)
  @ApiParam({ name: 'id', description: 'ID of session' })
  @Delete(':id')
  async delete(@Param('id') id: string) {
    await this._session.delete(id);
    return {
      status: true,
      message: 'Session deleted successfully',
    };
  }
}
