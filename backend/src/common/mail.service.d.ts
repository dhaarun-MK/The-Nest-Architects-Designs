import { ConfigService } from '@nestjs/config';
export declare class MailService {
    private config;
    private transporter;
    constructor(config: ConfigService);
    sendWelcomeEmail(to: string, name: string): Promise<void>;
    sendContactNotification(data: any): Promise<void>;
}
