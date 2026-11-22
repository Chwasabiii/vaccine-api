import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VaccinationRecordsService } from './vaccination-records.service';
import { VaccinationRecordsController } from './vaccination-records.controller';
import { VaccinationRecord } from './entities/vaccination-record.entity';

@Module({
  imports: [TypeOrmModule.forFeature([VaccinationRecord])],
  controllers: [VaccinationRecordsController],
  providers: [VaccinationRecordsService],
  exports: [TypeOrmModule, VaccinationRecordsService],
})
export class VaccinationRecordsModule {}