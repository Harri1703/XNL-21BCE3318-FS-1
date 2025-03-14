import { Injectable, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../users/user.service';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private jwtService: JwtService, private userService: UserService) {
    super();
  }

  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers.authorization;

    if (!authHeader) {
      console.error('❌ Missing Authorization header');
      throw new UnauthorizedException('Missing token');
    }

    const token = authHeader.split(' ')[1];

    try {
      const decoded = this.jwtService.verify(token);
      console.log('✅ Token Decoded:', decoded); // ✅ Debugging

      if (!decoded.email) {
        console.error('❌ Token missing email');
        throw new UnauthorizedException('Invalid token - Missing email');
      }

      // ✅ Fetch user by email
      const user = await this.userService.findByEmail(decoded.email);
      if (!user) {
        console.error('❌ Authenticated user not found');
        throw new UnauthorizedException('Authenticated user not found');
      }

      request.user = user; // ✅ Attach user details to request
      return true;
    } catch (error) {
      console.error('❌ JWT Verification Error:', error.message);
      throw new UnauthorizedException('Invalid token');
    }
  }
}
