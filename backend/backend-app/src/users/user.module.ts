import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]), // ✅ Register User entity
    forwardRef(() => AuthModule), // ✅ Use forwardRef to avoid circular dependency
  ],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService, TypeOrmModule], // ✅ Export UserService & TypeOrmModule
})
export class UsersModule {}
