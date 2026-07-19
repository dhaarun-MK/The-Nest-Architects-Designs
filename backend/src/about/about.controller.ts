import { Controller, Get, Put, Post, Patch, Delete, Param, Body, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiConsumes } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { AboutService } from './about.service';
import { CloudinaryService } from '../common/cloudinary.service';
import { JwtAuthGuard } from '../common/auth.guard';
import { RolesGuard } from '../common/roles.guard';
import { Roles } from '../common/roles.decorator';

@ApiTags('About')
@Controller('about')
export class AboutController {
  constructor(private service: AboutService, private cloudinary: CloudinaryService) {}

  @Get() get() { return this.service.get(); }

  @Put()
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  update(@Body() dto: any) { return this.service.update(dto); }

  @Post('team')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('img'))
  async addMember(@Body() body: any, @UploadedFile() file: Express.Multer.File) {
    const img = file ? await this.cloudinary.uploadImage(file, 'nest-architects/team') : '';
    return this.service.addTeamMember({ name: body.name, role: body.role, img });
  }

  @Patch('team/:index')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('img'))
  async updateMember(@Param('index') index: string, @Body() body: any, @UploadedFile() file: Express.Multer.File) {
    const img = file ? await this.cloudinary.uploadImage(file, 'nest-architects/team') : undefined;
    return this.service.updateTeamMember(+index, { name: body.name, role: body.role, ...(img && { img }) });
  }

  @Delete('team/:index')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  removeMember(@Param('index') index: string) { return this.service.removeTeamMember(+index); }
}
