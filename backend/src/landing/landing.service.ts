import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LandingPage } from './landing.entity';
import { CloudinaryService } from '../common/cloudinary.service';

@Injectable()
export class LandingService implements OnModuleInit {
  constructor(
    @InjectRepository(LandingPage) private repo: Repository<LandingPage>,
    private cloudinary: CloudinaryService,
  ) {}

  async onModuleInit() {
    const count = await this.repo.count();
    if (count === 0) await this.repo.save({});
  }

  async get() { return this.repo.findOne({ where: { id: 1 } }); }

  async update(dto: any, heroFile?: Express.Multer.File) {
    if (heroFile) dto.hero_image = await this.cloudinary.uploadImage(heroFile, 'landing');
    await this.repo.update(1, dto);
    return this.get();
  }
}
