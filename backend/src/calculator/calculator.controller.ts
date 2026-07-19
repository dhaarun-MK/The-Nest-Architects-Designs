import { Controller, Get, Post, Put, Delete, Param, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { CalculatorServiceProvider } from './calculator.service';
import { JwtAuthGuard } from '../common/auth.guard';
import { RolesGuard } from '../common/roles.guard';
import { Roles } from '../common/roles.decorator';

@ApiTags('Calculator')
@Controller('calculator')
export class CalculatorController {
  constructor(private service: CalculatorServiceProvider) {}

  @Get('services') getServices() { return this.service.findAll(); }

  @Get('services/all')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  getAllServices() { return this.service.findAllAdmin(); }

  @Get('project-types') getProjectTypes() { return this.service.getProjectTypes(); }

  @Post('project-types')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  addProjectType(@Body() body: { name: string }) { return this.service.addProjectType(body.name); }

  @Delete('project-types/:id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  removeProjectType(@Param('id') id: string) { return this.service.removeProjectType(+id); }

  @Post('calculate') calculate(@Body() body: any) { return this.service.calculate(body); }

  @Post()
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  create(@Body() dto: any) { return this.service.create(dto); }

  @Put(':id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  update(@Param('id') id: string, @Body() dto: any) { return this.service.update(+id, dto); }

  @Delete(':id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  remove(@Param('id') id: string) { return this.service.remove(+id); }
}
