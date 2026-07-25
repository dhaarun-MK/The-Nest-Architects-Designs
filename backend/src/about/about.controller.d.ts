import { AboutService } from './about.service';
import { CloudinaryService } from '../common/cloudinary.service';
export declare class AboutController {
    private service;
    private cloudinary;
    constructor(service: AboutService, cloudinary: CloudinaryService);
    get(): Promise<import("./about.entity").AboutPage>;
    update(dto: any): Promise<import("./about.entity").AboutPage>;
    addMember(body: any, file: Express.Multer.File): Promise<import("./about.entity").AboutPage>;
    updateMember(index: string, body: any, file: Express.Multer.File): Promise<import("./about.entity").AboutPage>;
    removeMember(index: string): Promise<import("./about.entity").AboutPage>;
}
