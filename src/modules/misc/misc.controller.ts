import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  HttpCode,
  Param,
  Patch,
  Post,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiOkResponse,
  ApiParam,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import csc from 'countries-states-cities';
import { ApiResponseDto } from './responses/api-response.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { HelperService } from 'src/utilities/helper.service';
import { FileDto } from './dto/file.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { DecryptDto } from './dto/decrypt.dto';
import { diskStorage } from 'multer';
import { ConfigService } from '@nestjs/config';
import { CountryResponseDto } from './responses/country-response.dto';
import { StateResponseDto } from './responses/state-response.dto';
import { CityResponseDto } from './responses/city-response.dto';
import { UploadResponseDto } from './responses/upload-response.dto';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorator/roles.decorator';
import { User } from '../user/entities/user.entity';
import { Repository } from 'typeorm';
import { Wallet } from '../wallet/entities/wallet.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { UserRole } from '../user/dto/user.dto';
import { LGA } from '../location/entities/lga.entity';
import { MiscService } from './misc.service';
import { SaveTokenDto, UpdateTokenDto } from './dto/device-token.dto';
import { DeviceToken } from './entities/device-tokens.entity';

@UseInterceptors(ClassSerializerInterceptor)
@ApiTags('Others')
@Controller('misc')
export class MiscController {
  constructor(
    private helperService: HelperService,
    private configService: ConfigService,
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(Wallet) private walletRepository: Repository<Wallet>,
    @InjectRepository(LGA) private lgaRepository: Repository<LGA>,
    @InjectRepository(DeviceToken)
    private deviceTokenRepository: Repository<DeviceToken>,
    private miscService: MiscService,
  ) {}

  /**
   * Retrieves all countries.
   *
   * @returns {Object} An object containing status, message, and data of type `CountryResponseDto`.
   */
  @ApiOkResponse({ status: 200, type: CountryResponseDto })
  @HttpCode(200)
  @Get('countries')
  getCountries() {
    return {
      status: true,
      message: 'success',
      data: csc.getAllCountries(),
    };
  }

  /**
   * Retrieves states of a specific country.
   *
   * @param {number} id - The ID of the country.
   * @returns {Object} An object containing status, message, and data of type `StateResponseDto`.
   */
  @ApiOkResponse({ status: 200, type: StateResponseDto })
  @HttpCode(200)
  @ApiParam({
    name: 'countryId',
    description: 'id of country',
  })
  @Get('states/:countryId')
  getStates(@Param('countryId') id: number) {
    return {
      status: true,
      message: 'success',
      data: csc.getStatesOfCountry(Number(id)),
    };
  }

  /**
   * Retrieves cities of a specific state.
   *
   * @param {number} id - The ID of the state.
   * @returns {Object} An object containing status, message, and data of type `CityResponseDto`.
   */
  @ApiOkResponse({ status: 200, type: CityResponseDto })
  @HttpCode(200)
  @ApiParam({
    name: 'stateId',
    description: 'id of state',
  })
  @Get('cities/:stateId')
  getCities(@Param('stateId') id: number) {
    return {
      status: true,
      message: 'success',
      data: csc.getCitiesOfState(Number(id)),
    };
  }

  @ApiOkResponse()
  @HttpCode(200)
  @Get('lgas')
  async getLgas() {
    return {
      status: true,
      message: 'success',
      data: await this.lgaRepository.find(),
    };
  }

  /**
   * Decrypts encrypted text using the helper service.
   *
   * @param {DecryptDto} encryptedText - The encrypted text to decrypt.
   * @returns {Object} An object containing status and decrypted message.
   */
  @ApiOkResponse({ type: ApiResponseDto })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @ApiBearerAuth('JWT-auth')
  @HttpCode(200)
  @Post('decrypt')
  async decrypt(@Body() encryptedText: DecryptDto) {
    const message = await this.helperService.decrypt(
      encryptedText.encrypted_text,
    );
    return {
      status: true,
      message,
    };
  }

  /**
   * Handles file upload and returns the uploaded file URL.
   *
   * @param {Express.Multer.File} file - The uploaded file.
   * @returns {Object} An object containing status, message, and the uploaded file URL.
   */
  @ApiOkResponse({ status: 200, type: UploadResponseDto })
  @ApiBody({ type: FileDto })
  @ApiConsumes('multipart/form-data')
  @Post('upload-file')
  @HttpCode(201)
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: (req: any, file, cb) => {
          const destination = './uploads/files';
          cb(null, destination);
        },
        filename: (req: any, file, cb) => {
          const splitted = file.originalname.split('.');
          const name = splitted[0];
          const ext = splitted[splitted.length - 1];
          const newName =
            name.split(' ').join('_') + '_' + Date.now() + '.' + ext;
          cb(null, newName);
        },
      }),
    }),
  )
  async upload(@UploadedFile() file: Express.Multer.File) {
    const url = this.configService.get<string>('app.serverUrl') + file.path;
    return {
      status: true,
      message: 'file uploaded successfully',
      data: { url },
    };
  }

  @Get('set-wallet')
  async setWallet() {
    const users = await this.userRepository.findBy({ roleId: UserRole.user });
    for (const user of users) {
      const wallet = await this.walletRepository.findOneBy({ userId: user.id });
      if (!wallet) {
        const create = await this.walletRepository.create({
          currencyCode: 'NGN',
          userId: user.id,
        });
        await this.walletRepository.save(create);
      }
    }
    return {
      status: true,
      message: 'success',
    };
  }

  @ApiOkResponse()
  @HttpCode(200)
  @ApiQuery({
    name: 'key',
    description: 'search parameter',
  })
  @Get('location/search')
  async searchLocation(@Query('key') search: string) {
    return {
      status: true,
      message: 'success',
      data: await this.miscService.searchLocation(search),
    };
  }

  @ApiOkResponse()
  @HttpCode(200)
  @Post('device/token')
  async saveDeviceToken(@Body() request: SaveTokenDto) {
    const exist = await this.deviceTokenRepository.findOneBy({
      token: request.token,
    });
    if (exist) {
      await this.deviceTokenRepository.update(exist.id, request);
    } else {
      const create = await this.deviceTokenRepository.create(request);
      await this.deviceTokenRepository.save(create);
    }

    return {
      status: true,
      message: 'success',
    };
  }

  @ApiOkResponse()
  @HttpCode(200)
  @Patch('device/token')
  async updateDeviceToken(@Body() request: UpdateTokenDto) {
    const exist = await this.deviceTokenRepository.findOneBy({
      deviceId: request.deviceId,
    });
    if (exist) {
      await this.deviceTokenRepository.update(exist.id, request);
    }
    return {
      status: true,
      message: 'success',
    };
  }
}
