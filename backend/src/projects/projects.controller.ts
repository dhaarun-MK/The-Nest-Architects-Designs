import { Controller, Get, Post, Put, Delete, Param, Body, UploadedFiles, UseGuards, UseInterceptors } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiConsumes } from '@nestjs/swagger';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { ProjectsService } from './projects.service';
import { CreateProjectDto } from './create-project.dto';
import { JwtAuthGuard } from '../common/auth.guard';
import { RolesGuard } from '../common/roles.guard';
import { Roles } from '../common/roles.decorator';

@ApiTags('Projects')
@Controller('projects')
export class ProjectsController {
  constructor(private service: ProjectsService) {}

  @Get() findAll() { return this.service.findAll(); }
  @Get(':id') findOne(@Param('id') id: string) { return this.service.findOne(+id); }

  @Post()
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileFieldsInterceptor([{ name: 'cover', maxCount: 1 }, { name: 'gallery', maxCount: 20 }]))
  async create(@Body() dto: CreateProjectDto, @UploadedFiles() files: any) {
    return this.service.create(dto, files.cover?.[0], files.gallery ?? []);
  }

  @Put(':id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileFieldsInterceptor([{ name: 'cover', maxCount: 1 }, { name: 'gallery', maxCount: 20 }]))
  async update(@Param('id') id: string, @Body() dto: CreateProjectDto, @UploadedFiles() files: any) {
    const removeIds = dto['remove_gallery_ids']
      ? String(dto['remove_gallery_ids']).split(',').map(Number).filter(Boolean)
      : [];
    return this.service.update(+id, dto, files?.cover?.[0], files?.gallery ?? [], removeIds);
  }

  @Delete(':id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  remove(@Param('id') id: string) { return this.service.remove(+id); }
}
