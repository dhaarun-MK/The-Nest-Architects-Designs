import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ContactMessage } from './contact-message.entity';
import { ContactService } from './contact.service';
import { ContactController } from './contact.controller';
import { CommonModule } from '../common/common.module';

@Module({
  imports: [TypeOrmModule.forFeature([ContactMessage]), CommonModule],
  providers: [ContactService],
  controllers: [ContactController],
})
export class ContactModule {}
