import { Repository } from 'typeorm';
import { ContactMessage } from './contact-message.entity';
import { CreateContactDto } from './create-contact.dto';
import { MailService } from '../common/mail.service';
export declare class ContactService {
    private repo;
    private mailService;
    constructor(repo: Repository<ContactMessage>, mailService: MailService);
    create(dto: CreateContactDto): Promise<CreateContactDto & ContactMessage>;
    findAll(): Promise<ContactMessage[]>;
    remove(id: number): Promise<{
        message: string;
    }>;
    markRead(id: number): Promise<{
        message: string;
    }>;
    count(): Promise<number>;
}
