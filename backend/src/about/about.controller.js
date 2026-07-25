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
exports.AboutController = void 0;
const openapi = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const platform_express_1 = require("@nestjs/platform-express");
const about_service_1 = require("./about.service");
const cloudinary_service_1 = require("../common/cloudinary.service");
const auth_guard_1 = require("../common/auth.guard");
const roles_guard_1 = require("../common/roles.guard");
const roles_decorator_1 = require("../common/roles.decorator");
let AboutController = class AboutController {
    constructor(service, cloudinary) {
        this.service = service;
        this.cloudinary = cloudinary;
    }
    get() { return this.service.get(); }
    update(dto) { return this.service.update(dto); }
    async addMember(body, file) {
        const img = file ? await this.cloudinary.uploadImage(file, 'nest-architects/team') : '';
        return this.service.addTeamMember({ name: body.name, role: body.role, img });
    }
    async updateMember(index, body, file) {
        const img = file ? await this.cloudinary.uploadImage(file, 'nest-architects/team') : undefined;
        return this.service.updateTeamMember(+index, { name: body.name, role: body.role, ...(img && { img }) });
    }
    removeMember(index) { return this.service.removeTeamMember(+index); }
};
exports.AboutController = AboutController;
__decorate([
    (0, common_1.Get)(),
    openapi.ApiResponse({ status: 200, type: require("./about.entity").AboutPage }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], AboutController.prototype, "get", null);
__decorate([
    (0, common_1.Put)(),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('admin'),
    openapi.ApiResponse({ status: 200, type: require("./about.entity").AboutPage }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], AboutController.prototype, "update", null);
__decorate([
    (0, common_1.Post)('team'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('admin'),
    (0, swagger_1.ApiConsumes)('multipart/form-data'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('img')),
    openapi.ApiResponse({ status: 201, type: require("./about.entity").AboutPage }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AboutController.prototype, "addMember", null);
__decorate([
    (0, common_1.Patch)('team/:index'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('admin'),
    (0, swagger_1.ApiConsumes)('multipart/form-data'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('img')),
    openapi.ApiResponse({ status: 200, type: require("./about.entity").AboutPage }),
    __param(0, (0, common_1.Param)('index')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", Promise)
], AboutController.prototype, "updateMember", null);
__decorate([
    (0, common_1.Delete)('team/:index'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('admin'),
    openapi.ApiResponse({ status: 200, type: require("./about.entity").AboutPage }),
    __param(0, (0, common_1.Param)('index')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], AboutController.prototype, "removeMember", null);
exports.AboutController = AboutController = __decorate([
    (0, swagger_1.ApiTags)('About'),
    (0, common_1.Controller)('about'),
    __metadata("design:paramtypes", [about_service_1.AboutService, cloudinary_service_1.CloudinaryService])
], AboutController);
//# sourceMappingURL=about.controller.js.map