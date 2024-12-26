import {
  ClassSerializerInterceptor,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Query,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { FindTransactionDto } from './dto/find-transaction.dto';
import { PageOptionsDto } from 'src/utilities/pagination/dtos';
import { TransactionService } from './transaction.service';
import { Roles } from '../auth/decorator/roles.decorator';
import { TransactionFindResponseDto } from './response/find-transaction-response.dto';
import { UserRole } from '../user/dto/user.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Userx } from 'src/decorator/userx.decorator';
import { User } from '../user/entities/user.entity';

@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('*')
@ApiBearerAuth('JWT-auth')
@UseInterceptors(ClassSerializerInterceptor)
@ApiTags('Transactions')
@Controller('transaction')
export class TransactionController {
  constructor(private readonly transactionService: TransactionService) {}
  /**
   * Retrieve a paginated list of transactions with optional filters.
   *
   * @param options - Pagination and filtering options.
   * @returns A paginated list of transactions.
   */
  @ApiOkResponse({
    status: 200,
    description: 'List of transactions',
    type: TransactionFindResponseDto,
  })
  @HttpCode(HttpStatus.OK)
  @Get()
  async findAll(
    @Userx() user: User,
    @Query() pageOptionDto: PageOptionsDto,
    @Query() options: FindTransactionDto,
  ) {
    options.userId = user.roleId == UserRole.user ? user.id : options.userId;
    const data = await this.transactionService.findAll(pageOptionDto, options);

    return {
      status: true,
      message: 'Transactions successfully retrieved',
      data: data,
    };
  }

  @ApiOkResponse({
    status: 200,
    description: 'List of transactions',
    type: TransactionFindResponseDto,
  })
  @HttpCode(HttpStatus.OK)
  @Get('wallet')
  async findAllWalletTransactions(
    @Userx() user: User,
    @Query() pageOptionDto: PageOptionsDto,
    @Query() options: FindTransactionDto,
  ) {
    options.userId = user.roleId == UserRole.user ? user.id : options.userId;
    const data = await this.transactionService.findAllWallet(
      pageOptionDto,
      options,
    );

    return {
      status: true,
      message: 'Transactions successfully retrieved',
      data: data,
    };
  }
}
