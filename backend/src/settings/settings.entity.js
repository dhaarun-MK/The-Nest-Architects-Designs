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
exports.Settings = void 0;
const openapi = require("@nestjs/swagger");
const typeorm_1 = require("typeorm");
let Settings = class Settings {
    static _OPENAPI_METADATA_FACTORY() {
        return { id: { required: true, type: () => Number }, company_name: { required: true, type: () => String }, email: { required: true, type: () => String }, phone: { required: true, type: () => String }, facebook: { required: true, type: () => String }, instagram: { required: true, type: () => String }, linkedin: { required: true, type: () => String }, logo: { required: true, type: () => String }, favicon: { required: true, type: () => String }, footer_text: { required: true, type: () => String }, smtp_host: { required: true, type: () => String }, smtp_port: { required: true, type: () => String }, smtp_user: { required: true, type: () => String }, smtp_pass: { required: true, type: () => String } };
    }
};
exports.Settings = Settings;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Settings.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: 'THE NEST ARCHITECTS' }),
    __metadata("design:type", String)
], Settings.prototype, "company_name", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: 'dhaarun@gmail.com' }),
    __metadata("design:type", String)
], Settings.prototype, "email", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Settings.prototype, "phone", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Settings.prototype, "facebook", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Settings.prototype, "instagram", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Settings.prototype, "linkedin", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Settings.prototype, "logo", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Settings.prototype, "favicon", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Settings.prototype, "footer_text", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Settings.prototype, "smtp_host", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Settings.prototype, "smtp_port", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Settings.prototype, "smtp_user", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Settings.prototype, "smtp_pass", void 0);
exports.Settings = Settings = __decorate([
    (0, typeorm_1.Entity)('settings')
], Settings);
//# sourceMappingURL=settings.entity.js.map