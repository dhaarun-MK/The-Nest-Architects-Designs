import { Injectable, OnModuleInit, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { User } from '../users/user.entity';
import { Admin } from './admin.entity';
import { MailService } from '../common/mail.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private userRepo: Repository<User>,
    @InjectRepository(Admin) private adminRepo: Repository<Admin>,
    private jwtService: JwtService,
    private mailService: MailService,
    private config: ConfigService,
  ) {}

  async googleLogin(googleUser: any) {
    let user = await this.userRepo.findOne({ where: { email: googleUser.email } });
    if (!user) {
      user = await this.userRepo.save(googleUser);
      await this.mailService.sendWelcomeEmail(user.email, user.name);
    }
    const token = this.jwtService.sign({ sub: user.id, email: user.email, role: user.role });
    return { access_token: token, user };
  }

  async adminLogin(username: string, password: string) {
    const admin = await this.adminRepo.findOne({ where: { username } });
    if (!admin) throw new UnauthorizedException('Invalid credentials');
    const valid = await bcrypt.compare(password, admin.password);
    if (!valid) throw new UnauthorizedException('Invalid credentials');
    const token = this.jwtService.sign({ sub: admin.id, email: admin.username, role: 'admin' });
    return { access_token: token };
  }

  async getProfile(userId: number) {
    return this.userRepo.findOne({ where: { id: userId } });
  }
}
