import { BadRequestException, Injectable } from '@nestjs/common';
import { DataSource, EntityManager } from 'typeorm';
import { BaseTransaction } from './base-transaction';
import { Transaction } from 'src/modules/transaction/entities/transaction.entity';
import { Wallet } from 'src/modules/wallet/entities/wallet.entity';

export interface DebitRequest {
  userId: string;
  amount: number;
  transaction?: Transaction | null;
}

export interface DebitResponse {
  amount: number;
  balanceBefore: number;
  balanceAfter: number;
  transaction: Transaction | null;
}

@Injectable()
export class DebitTransaction extends BaseTransaction<
  DebitRequest,
  DebitResponse
> {
  constructor(dataSource: DataSource) {
    super(dataSource);
  }

  protected async execute(
    request: DebitRequest,
    manager: EntityManager,
  ): Promise<DebitResponse> {
    const wallet = await manager.findOne(Wallet, {
      where: {
        userId: request.userId,
      },
      lock: {
        mode: 'pessimistic_write',
      },
    });

    if (!wallet) {
      throw new BadRequestException('User wallet not found');
    }

    const balanceBefore = wallet.balance;
    const balanceAfter = Number((wallet.balance - request.amount).toFixed(2));

    if (balanceAfter < 0) {
      throw new BadRequestException('Insufficient Funds');
    }

    await manager.update(Wallet, wallet.id, {
      balance: balanceAfter,
    });

    let transaction: Transaction = null;
    if (request.transaction) {
      request.transaction.balanceBefore = balanceBefore;
      request.transaction.balanceAfter = balanceAfter;
      transaction = await manager.save(Transaction, request.transaction);
    }

    return {
      amount: request.amount,
      balanceBefore,
      balanceAfter,
      transaction,
    };
  }
}
