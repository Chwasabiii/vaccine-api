import { PartialType } from '@nestjs/mapped-types';
import { IsBoolean, IsOptional } from 'class-validator';
import { CreateVaccineDto } from './create-vaccine.dto';

export class UpdateVaccineDto extends PartialType(CreateVaccineDto) {
  @IsOptional() @IsBoolean() isArchived?: boolean;
}
