import { ProjectsService } from './projects.service';
import { CreateProjectDto } from './create-project.dto';
export declare class ProjectsController {
    private service;
    constructor(service: ProjectsService);
    findAll(): Promise<import("./project.entity").Project[]>;
    findOne(id: string): Promise<import("./project.entity").Project>;
    create(dto: CreateProjectDto, files: any): Promise<import("./project.entity").Project>;
    update(id: string, dto: CreateProjectDto, files: any): Promise<import("./project.entity").Project>;
    remove(id: string): Promise<{
        message: string;
    }>;
}
