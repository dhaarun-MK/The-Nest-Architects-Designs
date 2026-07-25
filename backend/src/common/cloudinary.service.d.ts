import { ConfigService } from '@nestjs/config';
export declare class CloudinaryService {
    private config;
    constructor(config: ConfigService);
    uploadImage(file: Express.Multer.File, folder?: string): Promise<string>;
    deleteImage(publicId: string): Promise<any>;
}
