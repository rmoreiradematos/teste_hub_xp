import { IsArray, IsOptional, IsString } from 'class-validator';

export class DashboardFiltersDto {
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  categoryIds?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  productIds?: string[];

  @IsOptional()
  startDate?: Date;

  @IsOptional()
  endDate?: Date;
}
