import { Controller, Get, Put, Body, UploadedFiles, UseGuards, UseInterceptors } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { SettingsService } from './settings.service';
import { JwtAuthGuard } from '../common/auth.guard';
import { RolesGuard } from '../common/roles.guard';
import { Roles } from '../common/roles.decorator';

@ApiTags('Settings')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('admin')
@Controller('settings')
export class SettingsController {
  constructor(private service: SettingsService) {}

  @Get() get() { return this.service.get(); }

  @Put()
  @UseInterceptors(FileFieldsInterceptor([{ name: 'logo', maxCount: 1 }, { name: 'favicon', maxCount: 1 }]))
  update(@Body() dto: any, @UploadedFiles() files: any) {
    return this.service.update(dto, files?.logo?.[0], files?.favicon?.[0]);
  }
}
