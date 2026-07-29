import { Controller, Get, Post, Delete, Patch, Param, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { ContactService } from './contact.service';
import { CreateContactDto } from './create-contact.dto';
import { JwtAuthGuard } from '../common/auth.guard';
import { RolesGuard } from '../common/roles.guard';
import { Roles } from '../common/roles.decorator';

@ApiTags('Contact')
@Controller('contact')
export class ContactController {
  constructor(private service: ContactService) {}

  @Post() create(@Body() dto: CreateContactDto) { return this.service.create(dto); }

  @Get()
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  findAll() { return this.service.findAll(); }

  @Delete(':id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  remove(@Param('id') id: string) { return this.service.remove(+id); }

  @Patch(':id/read')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  markRead(@Param('id') id: string) { return this.service.markRead(+id); }

  @Patch(':id/pin')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  togglePin(@Param('id') id: string) { return this.service.togglePin(+id); }
}
