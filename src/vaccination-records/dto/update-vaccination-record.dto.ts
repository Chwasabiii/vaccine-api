import { OmitType, PartialType } from '@nestjs/mapped-types';
import { CreateVaccinationRecordDto } from './create-vaccination-record.dto';

export class UpdateVaccinationRecordDto extends PartialType(
  OmitType(CreateVaccinationRecordDto, ['studentId', 'vaccineId'] as const),
) {}