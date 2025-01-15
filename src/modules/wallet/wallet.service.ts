import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  DebitRequest,
  DebitResponse,
  DebitTransaction,
} from 'src/utilities/transactions/debit-transaction';
import {
  CreditRequest,
  CreditResponse,
  CreditTransaction,
} from 'src/utilities/transactions/credit-transaction';
import { Wallet } from './entities/wallet.entity';

@Injectable()
export class WalletService {
  constructor(
    @InjectRepository(Wallet) private walletRepository: Repository<Wallet>,
    private readonly debitTransaction: DebitTransaction,
    private readonly creditTransaction: CreditTransaction,
  ) {}

  /**
   * Processes a credit transaction.
   *
   * @param {CreditRequest} request - The request object containing details of the credit transaction.
   * @returns {Promise<CreditResponse>} A promise that resolves to the response of the credit transaction.
   */
  async credit(request: CreditRequest): Promise<CreditResponse> {
    return await this.creditTransaction.run(request);
  }

  /**
   * Processes a debit transaction.
   *
   * @param {DebitRequest} request - The request object containing details of the debit transaction.
   * @returns {Promise<DebitResponse>} A promise that resolves to the response of the debit transaction.
   */
  async debit(request: DebitRequest): Promise<DebitResponse> {
    return await this.debitTransaction.run(request);
  }

  async rawDebit(request: DebitRequest, fail = true) {
    const wallet = await this.walletRepository.findOneBy({
      userId: request.userId,
    });
    const balanceBefore = wallet.balance;
    const balanceAfter = wallet.balance - request.amount;
    if (fail) {
      if (balanceBefore < request.amount) {
        throw new BadRequestException('insufficient balance');
      }
    }
    await this.walletRepository.update(wallet.id, { balance: balanceAfter });
    return { balanceBefore, balanceAfter };
  }

  /**
   * Retrieves a wallet by its ID.
   *
   * @param {string} id - The ID of the wallet to retrieve.
   * @returns {Promise<Wallet>} A promise that resolves to the retrieved wallet.
   */
  async findOne(id: string): Promise<Wallet> {
    return await this.walletRepository.findOne({
      where: { id },
      relations: ['user'],
    });
  }

  async getBalance(userId: string): Promise<Wallet> {
    return await this.walletRepository.findOneBy({ userId });
  }

  async convertPoints(userId: string): Promise<Wallet> {
    const wallet = await this.walletRepository.findOneBy({ userId });
    await this.walletRepository.update(wallet.id, {
      points: 0,
      balance: wallet.balance + wallet.points,
    });
    return wallet;
  }
}
