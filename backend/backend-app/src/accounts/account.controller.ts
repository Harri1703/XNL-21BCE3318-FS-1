import { Controller, Post, Get, Body, UseGuards, Request } from '@nestjs/common';
import { AccountService } from './account.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RequestWithUser } from '../auth/request-user.interface';

@Controller('accounts')
export class AccountController {
  constructor(private accountService: AccountService) {}

  /**
   * ✅ Create a new account for the logged-in user using email
   */
  @UseGuards(JwtAuthGuard)
  @Post('create')
  async createAccount(@Request() req: RequestWithUser) {
    console.log('📌 Received User in Controller:', req.user);
    return this.accountService.create(req.user.email);
  }

  /**
   * ✅ Fetch all accounts of the logged-in user using email
   */
  @UseGuards(JwtAuthGuard)
  @Get('fetch')
  async getUserAccounts(@Request() req: RequestWithUser) {
    return this.accountService.findByUserEmail(req.user.email);
  }

  /**
   * ✅ Check balance of an account (by passing account number in body)
   */
  @UseGuards(JwtAuthGuard)
  @Post('getbalance')
  async getBalance(@Body() body: { accountNumber: string }) {
    return this.accountService.getBalance(body.accountNumber);
  }

  /**
   * ✅ Deposit money into an account
   */
  @UseGuards(JwtAuthGuard)
  @Post('deposit')
  async deposit(@Body() body: { accountNumber: string; amount: number }) {
    return this.accountService.deposit(body.accountNumber, body.amount);
  }

  /**
   * ✅ Withdraw money from an account
   */
  @UseGuards(JwtAuthGuard)
  @Post('withdraw')
  async withdraw(@Body() body: { accountNumber: string; amount: number }) {
    return this.accountService.withdraw(body.accountNumber, body.amount);
  }

  /**
   * ✅ Transfer money between two accounts
   */
  @UseGuards(JwtAuthGuard)
  @Post('transfer')
  async transfer(@Body() body: { fromAccountNumber: string; toAccountNumber: string; amount: number }) {
    return this.accountService.transfer(body.fromAccountNumber, body.toAccountNumber, body.amount);
  }
}
