import { Injectable, OnModuleInit, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProjectTypeService } from './project-type-service.entity';
import { ProjectType } from './project-type.entity';

// const DEFAULT_SERVICES = [
//   { serviceName: 'Floor Plan', price_per_sqft: 5, category: 'Architecture' },
//   { serviceName: 'Elevation', price_per_sqft: 4, category: 'Architecture' },
//   { serviceName: 'Structural', price_per_sqft: 8, category: 'Engineering' },
//   { serviceName: 'Electrical', price_per_sqft: 3, category: 'Engineering' },
//   { serviceName: 'Plumbing', price_per_sqft: 3, category: 'Engineering' },
//   { serviceName: 'Interior', price_per_sqft: 12, category: 'Interior' },
//   { serviceName: 'Landscape', price_per_sqft: 6, category: 'Exterior' },
//   { serviceName: '3D Design', price_per_sqft: 15, category: 'Visualization' },
//   { serviceName: 'Walkthrough', price_per_sqft: 10, category: 'Visualization' },
//   { serviceName: 'Site Visit', price_per_sqft: 2, category: 'Consultation' },
//   { serviceName: 'Consultation', price_per_sqft: 1, category: 'Consultation' },
// ];

// const DEFAULT_PROJECT_TYPES = ['Villa', 'House', 'Interior', 'Commercial', 'Office', 'Apartment', 'School', 'Hospital'];

@Injectable()
export class CalculatorServiceProvider 
// implements OnModuleInit 
{
  constructor(
    @InjectRepository(ProjectTypeService) private svcRepo: Repository<ProjectTypeService>,
    @InjectRepository(ProjectType) private ptRepo: Repository<ProjectType>,
  ) {}

  // async onModuleInit() {
  //   const ptCount = await this.ptRepo.count();
  //   if (ptCount === 0) {
  //     for (const name of DEFAULT_PROJECT_TYPES) {
  //       const pt = await this.ptRepo.save({ name });
  //       await this.svcRepo.save(DEFAULT_SERVICES.map(s => ({ ...s, project_type_id: pt.id })));
  //     }
  //   }
  // }

  getProjectTypes() { return this.ptRepo.find(); }

  async addProjectType(name: string, services: Partial<ProjectTypeService>[]) {
    const pt = await this.ptRepo.save({ name });
    if (services?.length) {
      await this.svcRepo.save(services.map(s => ({ ...s, project_type_id: pt.id })));
    }
    return this.ptRepo.findOne({ where: { id: pt.id } });
  }

  async removeProjectType(id: number) {
    await this.ptRepo.delete(id);
    return { message: 'Deleted' };
  }

  // Public: visible services for a specific project type
  async getServicesForType(projectTypeId: number) {
    return this.svcRepo.find({ where: { project_type_id: projectTypeId, is_visible: true } });
  }

  // Admin: all services for a specific project type
  async getAllServicesForType(projectTypeId: number) {
    return this.svcRepo.find({ where: { project_type_id: projectTypeId } });
  }

  async addService(projectTypeId: number, dto: Partial<ProjectTypeService>) {
    const pt = await this.ptRepo.findOne({ where: { id: projectTypeId } });
    if (!pt) throw new NotFoundException('Project type not found');
    return this.svcRepo.save({ ...dto, project_type_id: projectTypeId });
  }

  async updateService(id: number, dto: Partial<ProjectTypeService>) {
    await this.svcRepo.update(id, dto);
    return this.svcRepo.findOne({ where: { id } });
  }

  async removeService(id: number) {
    await this.svcRepo.delete(id);
    return { message: 'Service deleted' };
  }

  async calculate(body: any) {
    const GST_RATE = 0.18;
    const pt = await this.ptRepo.findOne({ where: { name: body.projectType } });
    if (!pt) return { architecture_fee: 0, gst: 0, total: 0 };

    const services = await this.svcRepo.find({ where: { project_type_id: pt.id, is_visible: true } });
    const selected = services.filter(s => body.services.includes(s.name));

    let fee = selected.reduce((sum, s) => {
      const price = Number(s.price_per_sqft) * (1 - s.discount / 100);
      return sum + price * body.area;
    }, 0);

    if (body.urgent) fee *= 1.2;
    const gst = fee * GST_RATE;
    return { architecture_fee: Math.round(fee), gst: Math.round(gst), total: Math.round(fee + gst) };
  }
}
