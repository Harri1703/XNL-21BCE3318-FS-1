import { Injectable, ConflictException, UnauthorizedException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private userRepo: Repository<User>,
    private jwtService: JwtService
  ) {}

  async findByEmail(email: string): Promise<User | undefined> {
    const user = await this.userRepo.findOne({ where: { email }, relations: ['accounts'] });
    return user ?? undefined;
  }

  async register(email: string, password: string): Promise<Omit<User, 'password'>> {
    const existingUser = await this.findByEmail(email);
    if (existingUser) {
      throw new ConflictException('Email already exists');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = this.userRepo.create({ email, password: hashedPassword, role: 'user' });
    const savedUser = await this.userRepo.save(user);

    return { id: savedUser.id, email: savedUser.email, role: savedUser.role, accounts: savedUser.accounts, transactions: savedUser.transactions };
  }

  async login(email: string, password: string) {
    const user = await this.findByEmail(email);
    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = { email: user.email, role: user.role };
    return { access_token: this.jwtService.sign(payload) };
  }

  async getAllUsers(requestingUser: User) {
    if (requestingUser.role !== 'admin') {
      throw new ForbiddenException('Access denied');
    }
    return this.userRepo.find({ relations: ['accounts'] });
  }
}
