import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  HttpCode,
  Param,
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
import { SaveTokenDto } from './dto/device-token.dto';
import { DeviceToken } from './entities/device-tokens.entity';
import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import * as dotenv from 'dotenv';
import { SendMailDto } from './dto/send-mail.dto';
import { NotificationGeneratorService } from '../notification/notification-generator/notification-generator.service';
import { Product } from '../product/entities/product.entity';
// import { FirebaseService } from '../notification/firebase/firebase.service';

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (req, file) => {
    const originalName = file.originalname.split('.')[0];
    const extension = file.originalname.split('.').pop();
    const randomString = generateRandomString(8);
    const uniqueFileName = `${originalName}_${randomString}.${extension}`;

    return {
      folder: 'uploads',
      resource_type: 'auto',
      public_id: uniqueFileName,
      transformation: [
        { width: 1000, crop: 'scale' }, // Resize (max 800x600)
        { quality: 'auto' }, // Optimize quality
        { fetch_format: 'auto' }, // Serve best format (WebP, JPEG, etc.)
      ],
    };
  },
});

const generateRandomString = (length = 6) => {
  return Math.random()
    .toString(36)
    .substring(2, 2 + length);
};

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
    private _ng: NotificationGeneratorService,
    // private firebaseService: FirebaseService,
    @InjectRepository(Product) private productRepository: Repository<Product>,
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

  @ApiOkResponse()
  @HttpCode(200)
  @Get('lgas/active')
  async getActiveLgas() {
    const lgasWithLocations = await this.lgaRepository
      .createQueryBuilder('lga')
      .innerJoin('lga.locations', 'location') // Only include LGAs that have locations
      .leftJoinAndSelect('lga.locations', 'locations') // Optionally select the locations
      .getMany();
    return {
      status: true,
      message: 'success',
      data: lgasWithLocations,
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

  @ApiOkResponse({ status: 200, type: UploadResponseDto })
  @ApiBody({ type: FileDto })
  @ApiConsumes('multipart/form-data')
  @Post('upload-file')
  @HttpCode(201)
  @UseInterceptors(FileInterceptor('file', { storage }))
  async upload(@UploadedFile() file: Express.Multer.File) {
    return {
      status: true,
      message: 'File uploaded successfully',
      data: { url: file.path },
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
      userId: request.userId,
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
  @Post('mail/send')
  async sendMail(@Body() request: SendMailDto) {
    await this._ng.sendContactMail(request);
    return {
      status: true,
      message: 'success',
    };
  }

  // @ApiOkResponse()
  // @HttpCode(200)
  // @Patch('device/token')
  // async updateDeviceToken(@Body() request: UpdateTokenDto) {
  //   const exist = await this.deviceTokenRepository.findOneBy({
  //     deviceId: request.deviceId,
  //   });
  //   if (exist) {
  //     await this.deviceTokenRepository.update(exist.id, request);
  //   }
  //   return {
  //     status: true,
  //     message: 'success',
  //   };
  // }

  // @ApiOkResponse()
  // @HttpCode(200)
  // @Patch('device/push')
  // async sendPush() {
  //   await this.firebaseService.sendNotification(
  //     [
  //       {
  //         token:
  //           'cAhiX41jSRmD9wfrWgjHwf:APA91bE1wdMQACUFgwScbJHqh2ljoPxjpvIlE44kgmsoqggilK10zr3x8yZIepFMmtAbw2G1ZJzgxud7Fp71dG7D0wC_DezXfDWbAW1g5hTobfoqZWeXeJE',
  //         deviceId: '1',
  //       },
  //     ] as DeviceToken[],
  //     'Hello',
  //     'Message',
  //   );
  //   return {
  //     status: true,
  //     message: 'success',
  //   };
  // }

  @ApiOkResponse()
  @HttpCode(200)
  @Get('product/upload')
  async uploadProduct() {
    await this.miscService.uploadProducts();
    return {
      status: true,
      message: 'success',
    };
  }

  @ApiOkResponse()
  @HttpCode(200)
  @Get('product/clean-image')
  async cleanImage() {
    const products = await this.productRepository.find();
    console.log(products.length);
    let count = 0;
    for (const product of products) {
      let image = product.image;
      image = image.replace(/\u00A0/g, ' ');
      image = image.replace(/\s+/g, ' ').trim();
      product.image = image;
      await this.productRepository.save(product);
      count++;
      console.log(`${count} of ${products.length}`);
    }
    return {
      status: true,
      message: 'success',
    };
  }
}
