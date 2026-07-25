import { OnModuleInit } from '@nestjs/common';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { User } from '../users/user.entity';
import { Admin } from './admin.entity';
import { MailService } from '../common/mail.service';
import { ConfigService } from '@nestjs/config';
export declare class AuthService implements OnModuleInit {
    private userRepo;
    private adminRepo;
    private jwtService;
    private mailService;
    private config;
    constructor(userRepo: Repository<User>, adminRepo: Repository<Admin>, jwtService: JwtService, mailService: MailService, config: ConfigService);
    onModuleInit(): Promise<void>;
    googleLogin(googleUser: any): Promise<{
        access_token: string;
        user: User;
    }>;
    adminLogin(username: string, password: string): Promise<{
        access_token: string;
    }>;
    getProfile(userId: number): Promise<User>;
}
