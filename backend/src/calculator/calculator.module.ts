import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CalculatorService } from './calculator-service.entity';
import { ProjectType } from './project-type.entity';
import { CalculatorServiceProvider } from './calculator.service';
import { CalculatorController } from './calculator.controller';

@Module({
  imports: [TypeOrmModule.forFeature([CalculatorService, ProjectType])],
  providers: [CalculatorServiceProvider],
  controllers: [CalculatorController],
})
export class CalculatorModule {}
