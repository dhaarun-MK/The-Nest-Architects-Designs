import { Repository } from 'typeorm';
import { Project } from './project.entity';
import { ProjectImage } from './project-image.entity';
import { CloudinaryService } from '../common/cloudinary.service';
import { CreateProjectDto } from './create-project.dto';
export declare class ProjectsService {
    private repo;
    private imageRepo;
    private cloudinary;
    constructor(repo: Repository<Project>, imageRepo: Repository<ProjectImage>, cloudinary: CloudinaryService);
    findAll(): Promise<Project[]>;
    findOne(id: number): Promise<Project>;
    create(dto: CreateProjectDto, coverFile?: Express.Multer.File, galleryFiles?: Express.Multer.File[]): Promise<Project>;
    update(id: number, dto: any, coverFile?: Express.Multer.File, galleryFiles?: Express.Multer.File[], removeGalleryIds?: number[]): Promise<Project>;
    remove(id: number): Promise<{
        message: string;
    }>;
    count(): Promise<number>;
}
