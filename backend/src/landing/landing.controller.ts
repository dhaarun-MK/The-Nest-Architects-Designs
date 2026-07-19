import { Controller, Get, Put, Body, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { LandingService } from './landing.service';
import { JwtAuthGuard } from '../common/auth.guard';
import { RolesGuard } from '../common/roles.guard';
import { Roles } from '../common/roles.decorator';

@ApiTags('Landing')
@Controller('landing')
export class LandingController {
  constructor(private service: LandingService) {}

  @Get() get() { return this.service.get(); }

  @Put()
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @UseInterceptors(FileInterceptor('hero_image'))
  update(@Body() dto: any, @UploadedFile() file: Express.Multer.File) {
    return this.service.update(dto, file);
  }
}
