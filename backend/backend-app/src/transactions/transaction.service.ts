import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Transaction } from './transaction.entity';
import { AccountService } from '../accounts/account.service';
import { Account } from '../accounts/account.entity';

@Injectable()
export class TransactionService {
  constructor(
    @InjectRepository(Transaction) private transactionRepo: Repository<Transaction>,
    private accountService: AccountService,
  ) {}

  async create(userId: number | null, account: Account, amount: number, type: string): Promise<Transaction> {
    const transaction = new Transaction();
    transaction.user = userId ? { id: userId } as any : null;
    transaction.account = account;
    transaction.amount = amount;
    transaction.type = type;
    return this.transactionRepo.save(transaction);
  }

  async findByUser(userId: number): Promise<Transaction[]> {
    return this.transactionRepo.find({
      where: { user: { id: userId } },
      relations: ['account'],
    });
  }

  async deposit(accountNumber: string, amount: number): Promise<Transaction> {
    const account = await this.accountService.findByAccountNumber(accountNumber);
    if (!account) throw new NotFoundException('Account not found');

    await this.accountService.deposit(accountNumber, amount);
    return this.create(account.user.id, account, amount, 'deposit');
  }

  async withdraw(accountNumber: string, amount: number): Promise<Transaction> {
    const account = await this.accountService.findByAccountNumber(accountNumber);
    if (!account) throw new NotFoundException('Account not found');

    if (account.balance < amount) throw new BadRequestException('Insufficient balance');

    await this.accountService.withdraw(accountNumber, amount);
    return this.create(account.user.id, account, amount, 'withdrawal');
  }

  async transfer(fromAccountNumber: string, toAccountNumber: string, amount: number): Promise<{ from: Transaction; to: Transaction }> {
    if (fromAccountNumber === toAccountNumber) {
      throw new BadRequestException('Cannot transfer to the same account');
    }

    const fromAccount = await this.accountService.findByAccountNumber(fromAccountNumber);
    const toAccount = await this.accountService.findByAccountNumber(toAccountNumber);

    if (!fromAccount || !toAccount) {
      throw new NotFoundException('One or both accounts not found');
    }

    // // ✅ Ensure accounts belong to different users
    // if (fromAccount.user.id === toAccount.user.id) {
    //   throw new BadRequestException('Cannot transfer money between accounts of the same user');
    // }

    if (fromAccount.balance < amount) {
      throw new BadRequestException('Insufficient funds');
    }

    // Deduct from sender
    await this.accountService.withdraw(fromAccountNumber, amount);
    // Add to receiver
    await this.accountService.deposit(toAccountNumber, amount);

    // Log transactions
    const fromTransaction = await this.create(fromAccount.user.id, fromAccount, amount, 'transfer-out');
    const toTransaction = await this.create(toAccount.user.id, toAccount, amount, 'transfer-in');

    return { from: fromTransaction, to: toTransaction };
  }
}
