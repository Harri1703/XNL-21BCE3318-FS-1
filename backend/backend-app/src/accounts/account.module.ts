import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Account } from './account.entity';
import { AccountService } from './account.service';
import { AccountController } from './account.controller';
import { User } from '../users/user.entity';
import { UsersModule } from '../users/user.module';
import { AuthModule } from '../auth/auth.module'; // ✅ Import AuthModule

@Module({
  imports: [
    TypeOrmModule.forFeature([Account, User]), // ✅ Ensure User is included
    forwardRef(() => UsersModule), // ✅ Ensure UsersModule is imported
    forwardRef(() => AuthModule), // ✅ Ensure AuthModule is imported
  ],
  controllers: [AccountController],
  providers: [AccountService],
  exports: [AccountService],
})
export class AccountsModule {}
