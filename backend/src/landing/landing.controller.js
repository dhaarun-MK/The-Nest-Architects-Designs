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
exports.LandingController = void 0;
const openapi = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const platform_express_1 = require("@nestjs/platform-express");
const landing_service_1 = require("./landing.service");
const auth_guard_1 = require("../common/auth.guard");
const roles_guard_1 = require("../common/roles.guard");
const roles_decorator_1 = require("../common/roles.decorator");
let LandingController = class LandingController {
    constructor(service) {
        this.service = service;
    }
    get() { return this.service.get(); }
    update(dto, file) {
        return this.service.update(dto, file);
    }
};
exports.LandingController = LandingController;
__decorate([
    (0, common_1.Get)(),
    openapi.ApiResponse({ status: 200, type: require("./landing.entity").LandingPage }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], LandingController.prototype, "get", null);
__decorate([
    (0, common_1.Put)(),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('admin'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('hero_image')),
    openapi.ApiResponse({ status: 200, type: require("./landing.entity").LandingPage }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], LandingController.prototype, "update", null);
exports.LandingController = LandingController = __decorate([
    (0, swagger_1.ApiTags)('Landing'),
    (0, common_1.Controller)('landing'),
    __metadata("design:paramtypes", [landing_service_1.LandingService])
], LandingController);
//# sourceMappingURL=landing.controller.js.map