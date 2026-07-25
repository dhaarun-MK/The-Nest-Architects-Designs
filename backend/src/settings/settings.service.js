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
exports.SettingsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const settings_entity_1 = require("./settings.entity");
const cloudinary_service_1 = require("../common/cloudinary.service");
let SettingsService = class SettingsService {
    constructor(repo, cloudinary) {
        this.repo = repo;
        this.cloudinary = cloudinary;
    }
    async onModuleInit() {
        const count = await this.repo.count();
        if (count === 0)
            await this.repo.save({});
    }
    get() { return this.repo.findOne({ where: { id: 1 } }); }
    async update(dto, logoFile, faviconFile) {
        if (logoFile)
            dto.logo = await this.cloudinary.uploadImage(logoFile, 'settings');
        if (faviconFile)
            dto.favicon = await this.cloudinary.uploadImage(faviconFile, 'settings');
        if (dto.remove_logo === 'true')
            dto.logo = null;
        if (dto.remove_favicon === 'true')
            dto.favicon = null;
        delete dto.remove_logo;
        delete dto.remove_favicon;
        await this.repo.update(1, dto);
        return this.get();
    }
};
exports.SettingsService = SettingsService;
exports.SettingsService = SettingsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(settings_entity_1.Settings)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        cloudinary_service_1.CloudinaryService])
], SettingsService);
//# sourceMappingURL=settings.service.js.map