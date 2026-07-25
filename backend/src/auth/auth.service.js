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
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const jwt_1 = require("@nestjs/jwt");
const bcrypt = require("bcrypt");
const user_entity_1 = require("../users/user.entity");
const admin_entity_1 = require("./admin.entity");
const mail_service_1 = require("../common/mail.service");
const config_1 = require("@nestjs/config");
let AuthService = class AuthService {
    constructor(userRepo, adminRepo, jwtService, mailService, config) {
        this.userRepo = userRepo;
        this.adminRepo = adminRepo;
        this.jwtService = jwtService;
        this.mailService = mailService;
        this.config = config;
    }
    async onModuleInit() {
        const existing = await this.adminRepo.findOne({ where: { username: 'dhaarun@gmail.com' } });
        if (!existing) {
            const hashed = await bcrypt.hash('Welcome123!', 10);
            await this.adminRepo.save({ username: 'dhaarun@gmail.com', password: hashed });
        }
    }
    async googleLogin(googleUser) {
        let user = await this.userRepo.findOne({ where: { email: googleUser.email } });
        if (!user) {
            user = await this.userRepo.save(googleUser);
            await this.mailService.sendWelcomeEmail(user.email, user.name);
        }
        const token = this.jwtService.sign({ sub: user.id, email: user.email, role: user.role });
        return { access_token: token, user };
    }
    async adminLogin(username, password) {
        const admin = await this.adminRepo.findOne({ where: { username } });
        if (!admin)
            throw new common_1.UnauthorizedException('Invalid credentials');
        const valid = await bcrypt.compare(password, admin.password);
        if (!valid)
            throw new common_1.UnauthorizedException('Invalid credentials');
        const token = this.jwtService.sign({ sub: admin.id, email: admin.username, role: 'admin' });
        return { access_token: token };
    }
    async getProfile(userId) {
        return this.userRepo.findOne({ where: { id: userId } });
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __param(1, (0, typeorm_1.InjectRepository)(admin_entity_1.Admin)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        jwt_1.JwtService,
        mail_service_1.MailService,
        config_1.ConfigService])
], AuthService);
//# sourceMappingURL=auth.service.js.map