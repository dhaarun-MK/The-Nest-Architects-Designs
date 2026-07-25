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
exports.CalculatorServiceProvider = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const calculator_service_entity_1 = require("./calculator-service.entity");
const project_type_entity_1 = require("./project-type.entity");
const DEFAULT_SERVICES = [
    { service: 'Floor Plan', price_per_sqft: 5, category: 'Architecture' },
    { service: 'Elevation', price_per_sqft: 4, category: 'Architecture' },
    { service: 'Structural', price_per_sqft: 8, category: 'Engineering' },
    { service: 'Electrical', price_per_sqft: 3, category: 'Engineering' },
    { service: 'Plumbing', price_per_sqft: 3, category: 'Engineering' },
    { service: 'Interior', price_per_sqft: 12, category: 'Interior' },
    { service: 'Landscape', price_per_sqft: 6, category: 'Exterior' },
    { service: '3D Design', price_per_sqft: 15, category: 'Visualization' },
    { service: 'Walkthrough', price_per_sqft: 10, category: 'Visualization' },
    { service: 'Site Visit', price_per_sqft: 2, category: 'Consultation' },
    { service: 'Consultation', price_per_sqft: 1, category: 'Consultation' },
];
const DEFAULT_PROJECT_TYPES = ['Villa', 'House', 'Interior', 'Commercial', 'Office', 'Apartment', 'School', 'Hospital'];
let CalculatorServiceProvider = class CalculatorServiceProvider {
    constructor(repo, ptRepo) {
        this.repo = repo;
        this.ptRepo = ptRepo;
    }
    async onModuleInit() {
        const count = await this.repo.count();
        if (count === 0)
            await this.repo.save(DEFAULT_SERVICES);
        const ptCount = await this.ptRepo.count();
        if (ptCount === 0)
            await this.ptRepo.save(DEFAULT_PROJECT_TYPES.map(name => ({ name })));
    }
    findAll() { return this.repo.find({ where: { is_visible: true } }); }
    findAllAdmin() { return this.repo.find(); }
    getProjectTypes() { return this.ptRepo.find(); }
    async addProjectType(name) { return this.ptRepo.save({ name }); }
    async removeProjectType(id) { await this.ptRepo.delete(id); return { message: 'Deleted' }; }
    calculate(body) {
        const GST_RATE = 0.18;
        return this.repo.find().then((all) => {
            const selected = all.filter((s) => body.services.includes(s.service));
            let fee = selected.reduce((sum, s) => {
                const typePrice = body.projectType && s.project_type_pricing?.[body.projectType];
                const basePrice = typePrice != null ? Number(typePrice) : Number(s.price_per_sqft);
                const price = basePrice * (1 - s.discount / 100);
                return sum + price * body.area;
            }, 0);
            if (body.urgent)
                fee *= 1.2;
            const gst = fee * GST_RATE;
            return { architecture_fee: Math.round(fee), gst: Math.round(gst), total: Math.round(fee + gst) };
        });
    }
    create(dto) { return this.repo.save(dto); }
    async update(id, dto) { await this.repo.update(id, dto); return this.repo.findOne({ where: { id } }); }
    async remove(id) { await this.repo.delete(id); return { message: 'Service deleted' }; }
};
exports.CalculatorServiceProvider = CalculatorServiceProvider;
exports.CalculatorServiceProvider = CalculatorServiceProvider = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(calculator_service_entity_1.CalculatorService)),
    __param(1, (0, typeorm_1.InjectRepository)(project_type_entity_1.ProjectType)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], CalculatorServiceProvider);
//# sourceMappingURL=calculator.service.js.map