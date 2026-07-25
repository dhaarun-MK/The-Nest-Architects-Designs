import { LandingService } from './landing.service';
export declare class LandingController {
    private service;
    constructor(service: LandingService);
    get(): Promise<import("./landing.entity").LandingPage>;
    update(dto: any, file: Express.Multer.File): Promise<import("./landing.entity").LandingPage>;
}
