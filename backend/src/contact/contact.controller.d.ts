import { ContactService } from './contact.service';
import { CreateContactDto } from './create-contact.dto';
export declare class ContactController {
    private service;
    constructor(service: ContactService);
    create(dto: CreateContactDto): Promise<CreateContactDto & import("./contact-message.entity").ContactMessage>;
    findAll(): Promise<import("./contact-message.entity").ContactMessage[]>;
    remove(id: string): Promise<{
        message: string;
    }>;
    markRead(id: string): Promise<{
        message: string;
    }>;
}
