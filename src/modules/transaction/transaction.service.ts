import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Transaction } from './entities/transaction.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Brackets, Repository } from 'typeorm';
import { TransactionStatus, TransactionType } from './dto/transaction.dto';
import { HelperService } from 'src/utilities/helper.service';
import { WalletService } from '../wallet/wallet.service';
import { validate as isUUID } from 'uuid';
import { PageMetaDto } from 'src/utilities/pagination/page-meta.dto';
import { PageDto } from 'src/utilities/pagination/page.dto';
import { FindTransactionDto } from './dto/find-transaction.dto';
import { PageOptionsDto } from 'src/utilities/pagination/dtos';
import {
  ChargeWalletDto,
  WebhookDeposit,
} from '../payment/dto/payment-initialize.dto';

@Injectable()
export class TransactionService {
  constructor(
    @InjectRepository(Transaction)
    private transactionRepository: Repository<Transaction>,
    private helperService: HelperService,
    private walletService: WalletService,
  ) {}

  async findOne(id: string, fail = true): Promise<Transaction> {
    const where: any[] = [
      {
        providerReference: id,
      },
      {
        reference: id,
      },
    ];
    if (isUUID(id)) {
      where.push({
        id,
      });
    }
    try {
      return await this.transactionRepository.findOneOrFail({
        where,
        relations: ['user'],
        select: {
          user: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
      });
    } catch (error) {
      console.log(error);
      if (fail) {
        throw new NotFoundException('transaction not found');
      }
      return null;
    }
  }

  async createDepositFromWebhook(deposit: WebhookDeposit) {
    try {
      if (!deposit.userId) {
        throw new BadRequestException('invalid userId');
      }
      const trx: Transaction = {
        userId: deposit.userId,
        amount: deposit.amount,
        amountCharged: deposit.amount,
        amountSettled: deposit.amount - deposit.fee,
        currency: deposit.currency,
        reference: 'CR-' + this.helperService.generateRandomAlphaNum(22),
        providerReference: deposit.reference,
        type: TransactionType.deposit,
        purpose: deposit.purpose,
        status: TransactionStatus.success,
        _status: TransactionStatus.success,
        fee: deposit.fee,
        providerFee: deposit.providerFee,
        settledAt: new Date(),
        paymentProvider: deposit.paymentProvider,
      };

      if (deposit.credit) {
        const credit = await this.walletService.credit({
          userId: deposit.userId,
          amount: trx.amountSettled,
          transaction: trx,
        });
        // this.notificationGenerator.sendTransactionNotification(
        //   credit.transaction.id,
        //   credit.transaction.purpose as TransactionPurpose,
        // );
        return credit.transaction;
      }
      return await this.transactionRepository.save(trx);
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  /**
   * Retrieves a paginated list of transactions with optional filters.
   *
   * @param pageOptionsDto - Pagination options (page, limit, order).
   * @param filter - Filtering options (status, userId, from, to, search).
   * @returns A paginated list of transactions.
   */
  async findAll(
    pageOptionsDto: PageOptionsDto,
    filter: FindTransactionDto,
  ): Promise<PageDto<Transaction>> {
    const transactions = this.transactionRepository
      .createQueryBuilder('transaction')
      .andWhere(filter.status ? 'transaction.status = :status' : '1=1', {
        status: filter.status,
      })
      .andWhere(filter.type ? 'transaction.type = :type' : '1=1', {
        type: filter.type,
      })
      .andWhere(filter.purpose ? 'transaction.purpose = :purpose' : '1=1', {
        purpose: filter.purpose,
      })
      .andWhere(filter.userId ? 'transaction.userId = :userId' : '1=1', {
        userId: filter.userId,
      })
      .andWhere(filter.from ? `transaction.createdAt >= :fromDate` : '1=1', {
        fromDate: filter.from,
      })
      .andWhere(filter.to ? `transaction.createdAt <= :toDate` : '1=1', {
        toDate: filter.to,
      })
      .andWhere(
        filter.search
          ? new Brackets((qb) => {
              qb.where('transaction.reference like :reference', {
                reference: '%' + filter.search + '%',
              });
            })
          : '1=1',
      )
      .orderBy('transaction.createdAt', pageOptionsDto.order)
      .skip(pageOptionsDto.skip)
      .take(pageOptionsDto.take);

    const itemCount = await transactions.getCount();
    const { entities } = await transactions.getRawAndEntities();

    const pageMetaDto = new PageMetaDto({ itemCount, pageOptionsDto });
    return new PageDto(entities, pageMetaDto);
  }

  async findAllWallet(
    pageOptionsDto: PageOptionsDto,
    filter: FindTransactionDto,
  ): Promise<PageDto<Transaction>> {
    const transactions = this.transactionRepository
      .createQueryBuilder('transaction')
      .where('transaction.balanceBefore IS NOT NULL')
      .andWhere(filter.status ? 'transaction.status = :status' : '1=1', {
        status: filter.status,
      })
      .andWhere(filter.type ? 'transaction.type = :type' : '1=1', {
        type: filter.type,
      })
      .andWhere(filter.purpose ? 'transaction.purpose = :purpose' : '1=1', {
        purpose: filter.purpose,
      })
      .andWhere(filter.userId ? 'transaction.userId = :userId' : '1=1', {
        userId: filter.userId,
      })
      .andWhere(filter.from ? `transaction.createdAt >= :fromDate` : '1=1', {
        fromDate: filter.from,
      })
      .andWhere(filter.to ? `transaction.createdAt <= :toDate` : '1=1', {
        toDate: filter.to,
      })
      .andWhere(
        filter.search
          ? new Brackets((qb) => {
              qb.where('transaction.reference like :reference', {
                reference: '%' + filter.search + '%',
              });
            })
          : '1=1',
      )
      .orderBy('transaction.createdAt', pageOptionsDto.order)
      .skip(pageOptionsDto.skip)
      .take(pageOptionsDto.take);

    const itemCount = await transactions.getCount();
    const { entities } = await transactions.getRawAndEntities();

    const pageMetaDto = new PageMetaDto({ itemCount, pageOptionsDto });
    return new PageDto(entities, pageMetaDto);
  }

  async chargeWallet(charge: ChargeWalletDto) {
    const trx: Transaction = {
      userId: charge.userId,
      amount: charge.amount,
      amountCharged: charge.amount,
      amountSettled: charge.amount,
      currency: 'NGN',
      reference: 'DR-' + this.helperService.generateRandomAlphaNum(22),
      providerReference: charge.reference,
      type: TransactionType.withdrawal,
      purpose: charge.purpose,
      status: TransactionStatus.success,
      _status: TransactionStatus.success,
      fee: 0,
      providerFee: 0,
      settledAt: new Date(),
      paymentProvider: charge.paymentProvider,
    };
    const debit = await this.walletService.rawDebit(
      {
        userId: charge.userId,
        amount: trx.amountSettled,
        transaction: trx,
      },
      true,
    );
    return debit.transaction;
  }
}
