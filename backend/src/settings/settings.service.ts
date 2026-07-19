import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Settings } from './settings.entity';
import { CloudinaryService } from '../common/cloudinary.service';

@Injectable()
export class SettingsService implements OnModuleInit {
  constructor(
    @InjectRepository(Settings) private repo: Repository<Settings>,
    private cloudinary: CloudinaryService,
  ) {}

  async onModuleInit() {
    const count = await this.repo.count();
    if (count === 0) await this.repo.save({});
  }

  get() { return this.repo.findOne({ where: { id: 1 } }); }

  async update(dto: any, logoFile?: Express.Multer.File, faviconFile?: Express.Multer.File) {
    if (logoFile) dto.logo = await this.cloudinary.uploadImage(logoFile, 'settings');
    if (faviconFile) dto.favicon = await this.cloudinary.uploadImage(faviconFile, 'settings');
    await this.repo.update(1, dto);
    return this.get();
  }
}
