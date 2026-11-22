import { IsDateString, IsInt, IsOptional, IsString, Min } from 'class-validator';

export class CreateVaccinationRecordDto {
  @IsInt() studentId: number;
  @IsInt() vaccineId: number;
  @IsDateString() vaccinationDate: string;
  @IsInt() @Min(1) doseNumber: number;
  @IsOptional() @IsString() remarks?: string;
}