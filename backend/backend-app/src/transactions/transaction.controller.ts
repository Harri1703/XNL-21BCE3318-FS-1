import { Controller, Post, Get, Body, UseGuards, Request } from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RequestWithUser } from '../auth/request-user.interface';

@Controller('transactions')
export class TransactionController {
  constructor(private transactionService: TransactionService) {}

  /**
   * ✅ Get transaction history of the logged-in user
   * - Protected: Requires a valid JWT token
   */
  @UseGuards(JwtAuthGuard)
  @Get('history')
  async getUserTransactions(@Request() req: RequestWithUser) {
    return this.transactionService.findByUser(req.user.id);
  }

  /**
   * ✅ Deposit money into an account
   * - Requires JWT authentication
   * - Takes accountNumber and amount in the body
   */
  @UseGuards(JwtAuthGuard)
  @Post('deposit')
  async deposit(@Body() body: { accountNumber: string; amount: number }) {
    return this.transactionService.deposit(body.accountNumber, body.amount);
  }

  /**
   * ✅ Withdraw money from an account
   * - Requires JWT authentication
   * - Takes accountNumber and amount in the body
   * - Ensures sufficient balance before processing
   */
  @UseGuards(JwtAuthGuard)
  @Post('withdraw')
  async withdraw(@Body() body: { accountNumber: string; amount: number }) {
    return this.transactionService.withdraw(body.accountNumber, body.amount);
  }

  /**
   * ✅ Transfer money between two accounts
   * - Requires JWT authentication
   * - Takes fromAccountNumber, toAccountNumber, and amount in the body
   * - Ensures accounts belong to different users
   * - Ensures sufficient balance before processing
   */
  @UseGuards(JwtAuthGuard)
  @Post('transfer')
  async transfer(@Body() body: { fromAccountNumber: string; toAccountNumber: string; amount: number }) {
    return this.transactionService.transfer(body.fromAccountNumber, body.toAccountNumber, body.amount);
  }
}
