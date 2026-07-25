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
exports.CalculatorController = void 0;
const openapi = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const calculator_service_1 = require("./calculator.service");
const auth_guard_1 = require("../common/auth.guard");
const roles_guard_1 = require("../common/roles.guard");
const roles_decorator_1 = require("../common/roles.decorator");
let CalculatorController = class CalculatorController {
    constructor(service) {
        this.service = service;
    }
    getServices() { return this.service.findAll(); }
    getAllServices() { return this.service.findAllAdmin(); }
    getProjectTypes() { return this.service.getProjectTypes(); }
    addProjectType(body) { return this.service.addProjectType(body.name); }
    removeProjectType(id) { return this.service.removeProjectType(+id); }
    calculate(body) { return this.service.calculate(body); }
    create(dto) { return this.service.create(dto); }
    update(id, dto) { return this.service.update(+id, dto); }
    remove(id) { return this.service.remove(+id); }
};
exports.CalculatorController = CalculatorController;
__decorate([
    (0, common_1.Get)('services'),
    openapi.ApiResponse({ status: 200, type: [require("./calculator-service.entity").CalculatorService] }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], CalculatorController.prototype, "getServices", null);
__decorate([
    (0, common_1.Get)('services/all'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('admin'),
    openapi.ApiResponse({ status: 200, type: [require("./calculator-service.entity").CalculatorService] }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], CalculatorController.prototype, "getAllServices", null);
__decorate([
    (0, common_1.Get)('project-types'),
    openapi.ApiResponse({ status: 200, type: [require("./project-type.entity").ProjectType] }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], CalculatorController.prototype, "getProjectTypes", null);
__decorate([
    (0, common_1.Post)('project-types'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('admin'),
    openapi.ApiResponse({ status: 201, type: Object }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], CalculatorController.prototype, "addProjectType", null);
__decorate([
    (0, common_1.Delete)('project-types/:id'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('admin'),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], CalculatorController.prototype, "removeProjectType", null);
__decorate([
    (0, common_1.Post)('calculate'),
    openapi.ApiResponse({ status: 201 }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], CalculatorController.prototype, "calculate", null);
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('admin'),
    openapi.ApiResponse({ status: 201, type: Object }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], CalculatorController.prototype, "create", null);
__decorate([
    (0, common_1.Put)(':id'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('admin'),
    openapi.ApiResponse({ status: 200, type: require("./calculator-service.entity").CalculatorService }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], CalculatorController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('admin'),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], CalculatorController.prototype, "remove", null);
exports.CalculatorController = CalculatorController = __decorate([
    (0, swagger_1.ApiTags)('Calculator'),
    (0, common_1.Controller)('calculator'),
    __metadata("design:paramtypes", [calculator_service_1.CalculatorServiceProvider])
], CalculatorController);
//# sourceMappingURL=calculator.controller.js.map