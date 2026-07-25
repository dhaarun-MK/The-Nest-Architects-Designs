import { CalculatorServiceProvider } from './calculator.service';
export declare class CalculatorController {
    private service;
    constructor(service: CalculatorServiceProvider);
    getServices(): Promise<import("./calculator-service.entity").CalculatorService[]>;
    getAllServices(): Promise<import("./calculator-service.entity").CalculatorService[]>;
    getProjectTypes(): Promise<import("./project-type.entity").ProjectType[]>;
    addProjectType(body: {
        name: string;
    }): Promise<{
        name: string;
    } & import("./project-type.entity").ProjectType>;
    removeProjectType(id: string): Promise<{
        message: string;
    }>;
    calculate(body: any): Promise<{
        architecture_fee: number;
        gst: number;
        total: number;
    }>;
    create(dto: any): Promise<any>;
    update(id: string, dto: any): Promise<import("./calculator-service.entity").CalculatorService>;
    remove(id: string): Promise<{
        message: string;
    }>;
}
