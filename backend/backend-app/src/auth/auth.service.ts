import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../users/user.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private userService: UserService
  ) {}

  async validateUser(email: string, password: string) {
    const user = await this.userService.findByEmail(email);
    if (user && await bcrypt.compare(password, user.password)) {
      return user;
    }
    return null;
  }

  async login(user: any) {
    if (!user.id) {
      throw new UnauthorizedException('User ID is missing, cannot generate token');
    }

    console.log('🚀 Logging in user:', user); // ✅ Debugging

    return {
      access_token: this.jwtService.sign({
        email: user.email,
        role: user.role,
      }),
    };
  }
}
