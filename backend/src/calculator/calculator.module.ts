import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CalculatorService } from './calculator-service.entity';
import { CalculatorServiceProvider } from './calculator.service';
import { CalculatorController } from './calculator.controller';

@Module({
  imports: [TypeOrmModule.forFeature([CalculatorService])],
  providers: [CalculatorServiceProvider],
  controllers: [CalculatorController],
})
export class CalculatorModule {}
