import { OnModuleInit } from '@nestjs/common';
import { Repository } from 'typeorm';
import { LandingPage } from './landing.entity';
import { CloudinaryService } from '../common/cloudinary.service';
export declare class LandingService implements OnModuleInit {
    private repo;
    private cloudinary;
    constructor(repo: Repository<LandingPage>, cloudinary: CloudinaryService);
    onModuleInit(): Promise<void>;
    get(): Promise<LandingPage>;
    update(dto: any, heroFile?: Express.Multer.File): Promise<LandingPage>;
}
