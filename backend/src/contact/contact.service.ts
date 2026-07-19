import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ContactMessage } from './contact-message.entity';
import { CreateContactDto } from './create-contact.dto';
import { MailService } from '../common/mail.service';

@Injectable()
export class ContactService {
  constructor(
    @InjectRepository(ContactMessage) private repo: Repository<ContactMessage>,
    private mailService: MailService,
  ) {}

  async create(dto: CreateContactDto) {
    const msg = await this.repo.save(dto);
    await this.mailService.sendContactNotification(dto);
    return msg;
  }

  findAll() { return this.repo.find({ order: { created_at: 'DESC' } }); }
  async remove(id: number) { await this.repo.delete(id); return { message: 'Message deleted' }; }
  async markRead(id: number) { await this.repo.update(id, { is_read: true }); return { message: 'Marked as read' }; }
  count() { return this.repo.count({ where: { is_read: false } }); }
}
