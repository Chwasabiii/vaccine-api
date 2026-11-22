import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VaccinationRecordsService } from './vaccination-records.service';
import { VaccinationRecordsController } from './vaccination-records.controller';
import { VaccinationRecord } from './entities/vaccination-record.entity';
import { Student } from '../students/entities/student.entity';
import { Vaccine } from '../vaccines/entities/vaccine.entity';
import { User } from '../users/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([VaccinationRecord, Student, Vaccine, User])],
  controllers: [VaccinationRecordsController],
  providers: [VaccinationRecordsService],
  exports: [TypeOrmModule, VaccinationRecordsService],
})
export class VaccinationRecordsModule {}