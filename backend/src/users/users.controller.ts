import { Controller, Get, Delete, Patch, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../common/auth.guard';
import { RolesGuard } from '../common/roles.guard';
import { Roles } from '../common/roles.decorator';

@ApiTags('Users')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('admin')
@Controller('users')
export class UsersController {
  constructor(private service: UsersService) {}

  @Get() findAll() { return this.service.findAll(); }
  @Delete(':id') remove(@Param('id') id: string) { return this.service.remove(+id); }
  @Patch(':id/block') block(@Param('id') id: string) { return this.service.block(+id); }
}
