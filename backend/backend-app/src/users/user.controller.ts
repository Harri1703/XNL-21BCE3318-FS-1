import { Controller, Post, Body, Get, UseGuards, Request, ForbiddenException } from '@nestjs/common';
import { UserService } from './user.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RequestWithUser } from '../auth/request-user.interface';

@Controller('users')
export class UserController {
  constructor(private userService: UserService) {}

  /**
   * ✅ Register a new user
   * - Default role: 'user'
   * - Prevents duplicate emails
   */
  @Post('register')
  async register(@Body() body: { email: string; password: string }) {
    return this.userService.register(body.email, body.password);
  }

  /**
   * ✅ Login user and return JWT token
   */
  @Post('login')
  async login(@Body() body: { email: string; password: string }) {
    return this.userService.login(body.email, body.password);
  }

  /**
   * ✅ Get profile of the logged-in user
   * - Requires JWT authentication
   */
  @UseGuards(JwtAuthGuard)
  @Get('me')
  async getUserProfile(@Request() req: RequestWithUser) {
    return { email: req.user.email, role: req.user.role };
  }

  /**
   * ✅ Get all users (Admin only)
   * - Requires JWT authentication
   * - Only 'admin' role can access
   */
  @UseGuards(JwtAuthGuard)
  @Get('all')
  async getUsers(@Request() req: RequestWithUser) {
    if (req.user.role !== 'admin') {
      throw new ForbiddenException('Access denied: Admins only');
    }
    return this.userService.getAllUsers(req.user);
  }
}
