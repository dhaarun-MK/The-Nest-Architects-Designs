import { OnModuleInit } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Settings } from './settings.entity';
import { CloudinaryService } from '../common/cloudinary.service';
export declare class SettingsService implements OnModuleInit {
    private repo;
    private cloudinary;
    constructor(repo: Repository<Settings>, cloudinary: CloudinaryService);
    onModuleInit(): Promise<void>;
    get(): Promise<Settings>;
    update(dto: any, logoFile?: Express.Multer.File, faviconFile?: Express.Multer.File): Promise<Settings>;
}
