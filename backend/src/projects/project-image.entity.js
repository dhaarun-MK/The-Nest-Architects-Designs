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
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProjectImage = void 0;
const openapi = require("@nestjs/swagger");
const typeorm_1 = require("typeorm");
const project_entity_1 = require("./project.entity");
let ProjectImage = class ProjectImage {
    static _OPENAPI_METADATA_FACTORY() {
        return { id: { required: true, type: () => Number }, image: { required: true, type: () => String }, project: { required: true, type: () => require("./project.entity").Project } };
    }
};
exports.ProjectImage = ProjectImage;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], ProjectImage.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], ProjectImage.prototype, "image", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => project_entity_1.Project, (project) => project.gallery, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'project_id' }),
    __metadata("design:type", project_entity_1.Project)
], ProjectImage.prototype, "project", void 0);
exports.ProjectImage = ProjectImage = __decorate([
    (0, typeorm_1.Entity)('project_images')
], ProjectImage);
//# sourceMappingURL=project-image.entity.js.map