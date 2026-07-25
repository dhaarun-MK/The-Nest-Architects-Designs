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
exports.AboutPage = void 0;
const openapi = require("@nestjs/swagger");
const typeorm_1 = require("typeorm");
let AboutPage = class AboutPage {
    static _OPENAPI_METADATA_FACTORY() {
        return { id: { required: true, type: () => Number }, overview: { required: true, type: () => String }, mission: { required: true, type: () => String }, vision: { required: true, type: () => String }, history: { required: true, type: () => String }, achievements: { required: true, type: () => String }, team_members: { required: true } };
    }
};
exports.AboutPage = AboutPage;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], AboutPage.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)('text', { nullable: true }),
    __metadata("design:type", String)
], AboutPage.prototype, "overview", void 0);
__decorate([
    (0, typeorm_1.Column)('text', { nullable: true }),
    __metadata("design:type", String)
], AboutPage.prototype, "mission", void 0);
__decorate([
    (0, typeorm_1.Column)('text', { nullable: true }),
    __metadata("design:type", String)
], AboutPage.prototype, "vision", void 0);
__decorate([
    (0, typeorm_1.Column)('text', { nullable: true }),
    __metadata("design:type", String)
], AboutPage.prototype, "history", void 0);
__decorate([
    (0, typeorm_1.Column)('text', { nullable: true }),
    __metadata("design:type", String)
], AboutPage.prototype, "achievements", void 0);
__decorate([
    (0, typeorm_1.Column)('jsonb', { nullable: true, default: [] }),
    __metadata("design:type", Array)
], AboutPage.prototype, "team_members", void 0);
exports.AboutPage = AboutPage = __decorate([
    (0, typeorm_1.Entity)('about_page')
], AboutPage);
//# sourceMappingURL=about.entity.js.map