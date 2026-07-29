import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  UseGuards,
} from "@nestjs/common";
import { ApiTags, ApiBearerAuth } from "@nestjs/swagger";
import { CalculatorServiceProvider } from "./calculator.service";
import { JwtAuthGuard } from "../common/auth.guard";
import { RolesGuard } from "../common/roles.guard";
import { Roles } from "../common/roles.decorator";

@ApiTags("Calculator")
@Controller("calculator")
export class CalculatorController {
  constructor(private service: CalculatorServiceProvider) {}

  @Get("project-types") getProjectTypes() {
    return this.service.getProjectTypes();
  }

  @Post("project-types")
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("admin")
  addProjectType(@Body() body: { name: string; services?: any[] }) {
    return this.service.addProjectType(body.name, body.services);
  }

  @Delete("project-types/:id")
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("admin")
  removeProjectType(@Param("id") id: string) {
    return this.service.removeProjectType(+id);
  }

  // Public: visible services for a project type
  @Get("project-types/:id/services")
  getServices(@Param("id") id: string) {
    return this.service.getServicesForType(+id);
  }

  // Admin: all services for a project type
  @Get("project-types/:id/services/all")
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("admin")
  getAllServices(@Param("id") id: string) {
    return this.service.getAllServicesForType(+id);
  }

  @Post("project-types/:id/services")
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("admin")
  addService(@Param("id") id: string, @Body() dto: any) {
    return this.service.addService(+id, dto);
  }

  @Put("services/:id")
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("admin")
  updateService(@Param("id") id: string, @Body() dto: any) {
    return this.service.updateService(+id, dto);
  }

  @Delete("services/:id")
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("admin")
  removeService(@Param("id") id: string) {
    return this.service.removeService(+id);
  }

  @Post("calculate") calculate(@Body() body: any) {
    return this.service.calculate(body);
  }
}
