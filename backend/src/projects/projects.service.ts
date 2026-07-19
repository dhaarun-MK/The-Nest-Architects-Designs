import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Project } from './project.entity';
import { ProjectImage } from './project-image.entity';
import { CloudinaryService } from '../common/cloudinary.service';
import { CreateProjectDto } from './create-project.dto';

@Injectable()
export class ProjectsService {
  constructor(
    @InjectRepository(Project) private repo: Repository<Project>,
    @InjectRepository(ProjectImage) private imageRepo: Repository<ProjectImage>,
    private cloudinary: CloudinaryService,
  ) {}

  findAll() { return this.repo.find({ order: { created_at: 'DESC' } }); }

  async findOne(id: number) {
    const project = await this.repo.findOne({ where: { id }, relations: ['gallery'] });
    if (!project) throw new NotFoundException('Project not found');
    return project;
  }

  async create(dto: CreateProjectDto, coverFile?: Express.Multer.File, galleryFiles: Express.Multer.File[] = []) {
    let cover_image: string;
    if (coverFile) cover_image = await this.cloudinary.uploadImage(coverFile, 'projects');
    const project = this.repo.create({ ...dto, cover_image });
    const saved = await this.repo.save(project);
    if (galleryFiles.length) {
      const images = await Promise.all(galleryFiles.map(async (f) => {
        const url = await this.cloudinary.uploadImage(f, 'projects/gallery');
        return this.imageRepo.create({ image: url, project: saved });
      }));
      await this.imageRepo.save(images);
    }
    return this.findOne(saved.id);
  }

  async update(id: number, dto: any, coverFile?: Express.Multer.File, galleryFiles: Express.Multer.File[] = [], removeGalleryIds: number[] = []) {
    const project = await this.findOne(id);
    if (coverFile) dto['cover_image'] = await this.cloudinary.uploadImage(coverFile, 'projects');
    Object.assign(project, dto);
    await this.repo.save(project);
    if (removeGalleryIds.length) await this.imageRepo.delete(removeGalleryIds);
    if (galleryFiles.length) {
      const images = await Promise.all(galleryFiles.map(async (f) => {
        const url = await this.cloudinary.uploadImage(f, 'projects/gallery');
        return this.imageRepo.create({ image: url, project });
      }));
      await this.imageRepo.save(images);
    }
    return this.findOne(id);
  }

  async remove(id: number) { await this.repo.delete(id); return { message: 'Project deleted' }; }
  count() { return this.repo.count(); }
}
