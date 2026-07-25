"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProjectsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const project_entity_1 = require("./project.entity");
const project_image_entity_1 = require("./project-image.entity");
const cloudinary_service_1 = require("../common/cloudinary.service");
let ProjectsService = class ProjectsService {
    constructor(repo, imageRepo, cloudinary) {
        this.repo = repo;
        this.imageRepo = imageRepo;
        this.cloudinary = cloudinary;
    }
    findAll() { return this.repo.find({ order: { created_at: 'DESC' } }); }
    async findOne(id) {
        const project = await this.repo.findOne({ where: { id }, relations: ['gallery'] });
        if (!project)
            throw new common_1.NotFoundException('Project not found');
        return project;
    }
    async create(dto, coverFile, galleryFiles = []) {
        let cover_image;
        if (coverFile)
            cover_image = await this.cloudinary.uploadImage(coverFile, 'projects');
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
    async update(id, dto, coverFile, galleryFiles = [], removeGalleryIds = []) {
        const project = await this.findOne(id);
        if (coverFile)
            dto['cover_image'] = await this.cloudinary.uploadImage(coverFile, 'projects');
        Object.assign(project, dto);
        await this.repo.save(project);
        if (removeGalleryIds.length)
            await this.imageRepo.delete(removeGalleryIds);
        if (galleryFiles.length) {
            const images = await Promise.all(galleryFiles.map(async (f) => {
                const url = await this.cloudinary.uploadImage(f, 'projects/gallery');
                return this.imageRepo.create({ image: url, project });
            }));
            await this.imageRepo.save(images);
        }
        return this.findOne(id);
    }
    async remove(id) { await this.repo.delete(id); return { message: 'Project deleted' }; }
    count() { return this.repo.count(); }
};
exports.ProjectsService = ProjectsService;
exports.ProjectsService = ProjectsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(project_entity_1.Project)),
    __param(1, (0, typeorm_1.InjectRepository)(project_image_entity_1.ProjectImage)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        cloudinary_service_1.CloudinaryService])
], ProjectsService);
//# sourceMappingURL=projects.service.js.map