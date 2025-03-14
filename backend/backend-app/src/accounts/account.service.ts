import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Account } from './account.entity';
import { User } from '../users/user.entity';

@Injectable()
export class AccountService {
  constructor(
    @InjectRepository(Account) private accountRepo: Repository<Account>,
    @InjectRepository(User) private userRepo: Repository<User>
  ) {}

  /**
   * ✅ Create a new account using email
   */
  async create(userEmail: string): Promise<Account> {
    console.log('🚀 Creating account for email:', userEmail);

    const existingUser = await this.userRepo.findOne({ where: { email: userEmail } });
    if (!existingUser) {
      throw new NotFoundException('User not found');
    }

    const account = new Account();
    account.accountNumber = `ACC-${Math.random().toString(36).substr(2, 9)}`;
    account.user = existingUser;
    account.balance = 0;

    return await this.accountRepo.save(account);
  }

  /**
   * ✅ Fetch all accounts for the authenticated user using email
   */
  async findByUserEmail(email: string): Promise<Account[]> {
    const user = await this.userRepo.findOne({ where: { email }, relations: ['accounts'] });
    if (!user) throw new NotFoundException('User not found');
    return user.accounts;
  }

  /**
   * ✅ Find an account by account number
   */
  async findByAccountNumber(accountNumber: string): Promise<Account | undefined> {
    const account = await this.accountRepo.findOne({ where: { accountNumber }, relations: ['user'] });
    return account ?? undefined;
  }

  /**
   * ✅ Get balance of an account
   */
  async getBalance(accountNumber: string): Promise<{ accountNumber: string; balance: string }> {
    const account = await this.findByAccountNumber(accountNumber);
    if (!account) throw new NotFoundException('Account not found');

    return {
      accountNumber: account.accountNumber,
      balance: parseFloat(account.balance.toString()).toFixed(2),
    };
  }

  /**
   * ✅ Deposit money into an account
   */
  async deposit(accountNumber: string, amount: number): Promise<{ accountNumber: string; balance: string }> {
    if (amount <= 0) throw new BadRequestException('Deposit amount must be greater than zero');
  
    const account = await this.findByAccountNumber(accountNumber);
    if (!account) throw new NotFoundException('Account not found');
  
    // ✅ Ensure balance is treated as a number before calculations
    const currentBalance = parseFloat(account.balance?.toString() || '0');
    const newBalance = (currentBalance + amount).toFixed(2);
  
    account.balance = parseFloat(newBalance);
    const updatedAccount = await this.accountRepo.save(account);
  
    return {
      accountNumber: updatedAccount.accountNumber,
      balance: updatedAccount.balance.toFixed(2), // ✅ Ensure response is formatted correctly
    };
  }
  

  /**
   * ✅ Withdraw money from an account
   */
  async withdraw(accountNumber: string, amount: number): Promise<{ accountNumber: string; balance: string }> {
    if (amount <= 0) throw new BadRequestException('Withdrawal amount must be greater than zero');

    const account = await this.findByAccountNumber(accountNumber);
    if (!account) throw new NotFoundException('Account not found');

    if (account.balance < amount) throw new BadRequestException('Insufficient balance');

    account.balance = parseFloat((account.balance - amount).toFixed(2));
    await this.accountRepo.save(account);

    return {
      accountNumber: account.accountNumber,
      balance: account.balance.toFixed(2),
    };
  }

  /**
   * ✅ Transfer money between two accounts
   */
  async transfer(fromAccountNumber: string, toAccountNumber: string, amount: number): Promise<{ from: Account; to: Account }> {
    if (amount <= 0) throw new BadRequestException('Transfer amount must be greater than zero');
    if (fromAccountNumber === toAccountNumber) throw new BadRequestException('Cannot transfer to the same account');

    const fromAccount = await this.findByAccountNumber(fromAccountNumber);
    const toAccount = await this.findByAccountNumber(toAccountNumber);

    if (!fromAccount || !toAccount) {
      throw new NotFoundException('One or both accounts not found');
    }

    if (fromAccount.balance < amount) {
      throw new BadRequestException('Insufficient funds');
    }

    fromAccount.balance = parseFloat((fromAccount.balance - amount).toFixed(2));
    toAccount.balance = parseFloat((toAccount.balance + amount).toFixed(2));

    await this.accountRepo.save(fromAccount);
    await this.accountRepo.save(toAccount);

    return { from: fromAccount, to: toAccount };
  }
}
