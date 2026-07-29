import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { LessThan, Repository } from 'typeorm';
import { Cron, CronExpression } from '@nestjs/schedule';
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

  findAll() { return this.repo.find({ order: { is_pinned: 'DESC', created_at: 'DESC' } }); }
  async remove(id: number) { await this.repo.delete(id); return { message: 'Message deleted' }; }
  async markRead(id: number) { await this.repo.update(id, { is_read: true }); return { message: 'Marked as read' }; }
  count() { return this.repo.count({ where: { is_read: false } }); }

  async togglePin(id: number) {
    const msg = await this.repo.findOneBy({ id });
    await this.repo.update(id, { is_pinned: !msg.is_pinned });
    return { is_pinned: !msg.is_pinned };
  }

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async deleteOldUnpinned() {
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - 30);
    await this.repo.delete({ is_pinned: false, created_at: LessThan(cutoff) });
  }
}
