import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CalculatorService } from './calculator-service.entity';

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

@Injectable()
export class CalculatorServiceProvider implements OnModuleInit {
  constructor(@InjectRepository(CalculatorService) private repo: Repository<CalculatorService>) {}

  async onModuleInit() {
    const count = await this.repo.count();
    if (count === 0) await this.repo.save(DEFAULT_SERVICES);
  }

  findAll() { return this.repo.find({ where: { is_visible: true } }); }
  findAllAdmin() { return this.repo.find(); }

  calculate(body: any) {
    const GST_RATE = 0.18;
    return this.repo.find().then((all) => {
      const selected = all.filter((s) => body.services.includes(s.service));
      let fee = selected.reduce((sum, s) => {
        const typePrice = body.projectType && s.project_type_pricing?.[body.projectType];
        const basePrice = typePrice != null ? Number(typePrice) : Number(s.price_per_sqft);
        const price = basePrice * (1 - s.discount / 100);
        return sum + price * body.area;
      }, 0);
      if (body.urgent) fee *= 1.2;
      const gst = fee * GST_RATE;
      return { architecture_fee: Math.round(fee), gst: Math.round(gst), total: Math.round(fee + gst) };
    });
  }

  create(dto: any) { return this.repo.save(dto); }
  async update(id: number, dto: any) { await this.repo.update(id, dto); return this.repo.findOne({ where: { id } }); }
  async remove(id: number) { await this.repo.delete(id); return { message: 'Service deleted' }; }
}
