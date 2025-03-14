import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Transaction } from './transaction.entity';
import { TransactionService } from './transaction.service';
import { TransactionController } from './transaction.controller';
import { AccountService } from '../accounts/account.service';
import { Account } from '../accounts/account.entity';
import { User } from '../users/user.entity'; // ✅ Import User entity
import { AuthModule } from '../auth/auth.module'; // ✅ Import AuthModule
import { UsersModule } from '../users/user.module'; // ✅ Import UsersModule

@Module({
  imports: [
    TypeOrmModule.forFeature([Transaction, Account, User]), // ✅ Ensure User entity is included
    forwardRef(() => AuthModule), // ✅ Ensure AuthModule is imported
    forwardRef(() => UsersModule), // ✅ Ensure UsersModule is imported
  ],
  controllers: [TransactionController],
  providers: [TransactionService, AccountService],
  exports: [TransactionService],
})
export class TransactionsModule {}
