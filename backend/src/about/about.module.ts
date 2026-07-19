import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AboutPage } from './about.entity';
import { AboutService } from './about.service';
import { AboutController } from './about.controller';
import { CommonModule } from '../common/common.module';

@Module({
  imports: [TypeOrmModule.forFeature([AboutPage]), CommonModule],
  providers: [AboutService],
  controllers: [AboutController],
})
export class AboutModule {}
