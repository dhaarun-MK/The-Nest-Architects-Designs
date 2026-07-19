import { IsString, IsNumber, IsOptional, IsBoolean } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateProjectDto {
  @IsString() title: string;
  @IsString() description: string;
  @IsString() category: string;
  @IsString() location: string;
  @Type(() => Number) @IsNumber() budget: number;
  @IsString() duration: string;
  @IsOptional() @IsString() client_name?: string;
  @IsOptional() @IsString() completed_date?: string;
  @IsOptional() @IsString() materials_used?: string;
  @IsOptional() @IsString() challenges?: string;
  @IsOptional() @IsString() testimonial?: string;
  @IsOptional() @Type(() => Boolean) @IsBoolean() is_featured?: boolean;
  @IsOptional() @IsString() status?: string;
}
