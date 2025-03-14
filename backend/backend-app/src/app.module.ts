import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from './users/user.module';
import { AuthModule } from './auth/auth.module';
import { TransactionsModule } from './transactions/transaction.module';
import { AccountsModule } from './accounts/account.module';
import { DataSource } from 'typeorm';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT),
      username: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.DB_NAME,
      autoLoadEntities: true,
      synchronize: true,
      logging: true,
      extra: {
        ssl: { rejectUnauthorized: false },
      },
    }),
    UsersModule, // ✅ Ensure UsersModule is imported
    AuthModule, // ✅ Ensure AuthModule is imported
    TransactionsModule,
    AccountsModule,
  ],
})
export class AppModule {}
