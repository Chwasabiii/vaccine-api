import { IsInt, IsNumber, IsOptional, IsString, MaxLength, Min } from 'class-validator';

export class CreateVaccineDto {
  @IsString() @MaxLength(100) vaccineName: string;
  @IsOptional() @IsString() description?: string;
  @IsNumber({ maxDecimalPlaces: 2 }) @Min(0) price: number;
  @IsInt() @Min(0) stockQuantity: number;
  @IsInt() @Min(0) reorderLevel: number;
}