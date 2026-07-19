import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LandingPage } from './landing.entity';
import { LandingService } from './landing.service';
import { LandingController } from './landing.controller';
import { CommonModule } from '../common/common.module';

@Module({
  imports: [TypeOrmModule.forFeature([LandingPage]), CommonModule],
  providers: [LandingService],
  controllers: [LandingController],
})
export class LandingModule {}
