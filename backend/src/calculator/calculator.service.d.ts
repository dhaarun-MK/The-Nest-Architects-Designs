import { OnModuleInit } from '@nestjs/common';
import { Repository } from 'typeorm';
import { CalculatorService } from './calculator-service.entity';
import { ProjectType } from './project-type.entity';
export declare class CalculatorServiceProvider implements OnModuleInit {
    private repo;
    private ptRepo;
    constructor(repo: Repository<CalculatorService>, ptRepo: Repository<ProjectType>);
    onModuleInit(): Promise<void>;
    findAll(): Promise<CalculatorService[]>;
    findAllAdmin(): Promise<CalculatorService[]>;
    getProjectTypes(): Promise<ProjectType[]>;
    addProjectType(name: string): Promise<{
        name: string;
    } & ProjectType>;
    removeProjectType(id: number): Promise<{
        message: string;
    }>;
    calculate(body: any): Promise<{
        architecture_fee: number;
        gst: number;
        total: number;
    }>;
    create(dto: any): Promise<any>;
    update(id: number, dto: any): Promise<CalculatorService>;
    remove(id: number): Promise<{
        message: string;
    }>;
}
