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
exports.LandingPage = void 0;
const openapi = require("@nestjs/swagger");
const typeorm_1 = require("typeorm");
let LandingPage = class LandingPage {
    static _OPENAPI_METADATA_FACTORY() {
        return { id: { required: true, type: () => Number }, hero_image: { required: true, type: () => String }, company_name: { required: true, type: () => String }, tagline: { required: true, type: () => String }, overview: { required: true, type: () => String }, mission: { required: true, type: () => String }, vision: { required: true, type: () => String }, cta_primary: { required: true, type: () => String }, cta_secondary: { required: true, type: () => String } };
    }
};
exports.LandingPage = LandingPage;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], LandingPage.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], LandingPage.prototype, "hero_image", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: 'THE NEST ARCHITECTS' }),
    __metadata("design:type", String)
], LandingPage.prototype, "company_name", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: 'Designing Spaces. Creating Dreams.' }),
    __metadata("design:type", String)
], LandingPage.prototype, "tagline", void 0);
__decorate([
    (0, typeorm_1.Column)('text', { nullable: true }),
    __metadata("design:type", String)
], LandingPage.prototype, "overview", void 0);
__decorate([
    (0, typeorm_1.Column)('text', { nullable: true }),
    __metadata("design:type", String)
], LandingPage.prototype, "mission", void 0);
__decorate([
    (0, typeorm_1.Column)('text', { nullable: true }),
    __metadata("design:type", String)
], LandingPage.prototype, "vision", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: 'Get Started' }),
    __metadata("design:type", String)
], LandingPage.prototype, "cta_primary", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: 'Sign in with Google' }),
    __metadata("design:type", String)
], LandingPage.prototype, "cta_secondary", void 0);
exports.LandingPage = LandingPage = __decorate([
    (0, typeorm_1.Entity)('landing_page')
], LandingPage);
//# sourceMappingURL=landing.entity.js.map