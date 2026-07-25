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
exports.CalculatorService = void 0;
const openapi = require("@nestjs/swagger");
const typeorm_1 = require("typeorm");
let CalculatorService = class CalculatorService {
    static _OPENAPI_METADATA_FACTORY() {
        return { id: { required: true, type: () => Number }, service: { required: true, type: () => String }, price_per_sqft: { required: true, type: () => Number }, project_type_pricing: { required: true, type: () => Object }, category: { required: true, type: () => String }, discount: { required: true, type: () => Number }, is_visible: { required: true, type: () => Boolean } };
    }
};
exports.CalculatorService = CalculatorService;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], CalculatorService.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], CalculatorService.prototype, "service", void 0);
__decorate([
    (0, typeorm_1.Column)('decimal', { precision: 10, scale: 2 }),
    __metadata("design:type", Number)
], CalculatorService.prototype, "price_per_sqft", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'jsonb', nullable: true, default: {} }),
    __metadata("design:type", Object)
], CalculatorService.prototype, "project_type_pricing", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], CalculatorService.prototype, "category", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: 0 }),
    __metadata("design:type", Number)
], CalculatorService.prototype, "discount", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: true }),
    __metadata("design:type", Boolean)
], CalculatorService.prototype, "is_visible", void 0);
exports.CalculatorService = CalculatorService = __decorate([
    (0, typeorm_1.Entity)('calculator_services')
], CalculatorService);
//# sourceMappingURL=calculator-service.entity.js.map