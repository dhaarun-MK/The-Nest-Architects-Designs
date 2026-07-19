import { Module } from '@nestjs/common';
import { MailService } from './mail.service';
import { CloudinaryService } from './cloudinary.service';

@Module({
  providers: [MailService, CloudinaryService],
  exports: [MailService, CloudinaryService],
})
export class CommonModule {}
