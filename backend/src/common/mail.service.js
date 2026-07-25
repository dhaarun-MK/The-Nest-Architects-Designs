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
exports.MailService = void 0;
const common_1 = require("@nestjs/common");
const nodemailer = require("nodemailer");
const config_1 = require("@nestjs/config");
let MailService = class MailService {
    constructor(config) {
        this.config = config;
        this.transporter = nodemailer.createTransport({
            host: config.get('SMTP_HOST'),
            port: +config.get('SMTP_PORT'),
            secure: false,
            auth: { user: config.get('SMTP_USER'), pass: config.get('SMTP_PASS') },
        });
    }
    async sendWelcomeEmail(to, name) {
        await this.transporter.sendMail({
            from: `"THE NEST ARCHITECTS" <${this.config.get('SMTP_USER')}>`,
            to,
            subject: 'Welcome to THE NEST ARCHITECTS',
            html: `<h2>Hello ${name},</h2><p>Thank you for visiting <strong>THE NEST ARCHITECTS</strong>.</p><p>We are excited to help you build your dream projects.</p><br/><p>Regards,<br/><strong>THE NEST ARCHITECTS</strong></p>`,
        });
    }
    async sendContactNotification(data) {
        await this.transporter.sendMail({
            from: `"THE NEST ARCHITECTS" <${this.config.get('SMTP_USER')}>`,
            to: this.config.get('ADMIN_EMAIL'),
            subject: `New Contact: ${data.subject}`,
            html: `<h3>New Contact Message</h3><p><strong>From:</strong> ${data.name} (${data.email})</p><p><strong>Subject:</strong> ${data.subject}</p><p><strong>Message:</strong><br/>${data.message}</p>`,
        });
    }
};
exports.MailService = MailService;
exports.MailService = MailService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], MailService);
//# sourceMappingURL=mail.service.js.map