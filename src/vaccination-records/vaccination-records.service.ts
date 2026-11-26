import {
  ConflictException, ForbiddenException, Injectable, NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { Student } from '../students/entities/student.entity';
import { Role, User } from '../users/entities/user.entity';
import { Vaccine } from '../vaccines/entities/vaccine.entity';
import { CreateVaccinationRecordDto } from './dto/create-vaccination-record.dto';
import { UpdateVaccinationRecordDto } from './dto/update-vaccination-record.dto';
import { VaccinationRecord } from './entities/vaccination-record.entity';

type AuthUser = { id: number; email: string; role: Role };

const RELATIONS = {
  student: { user: true },
  vaccine: true,
  administeredBy: true,
} as const;

@Injectable()
export class VaccinationRecordsService {
  constructor(
    @InjectRepository(VaccinationRecord) private repo: Repository<VaccinationRecord>,
    @InjectRepository(Student) private students: Repository<Student>,
    @InjectRepository(Vaccine) private vaccines: Repository<Vaccine>,
    private dataSource: DataSource,
  ) {}

  async create(dto: CreateVaccinationRecordDto, current: AuthUser) {
    const record = await this.dataSource.transaction(async (manager) => {
      const students = manager.getRepository(Student);
      const vaccines = manager.getRepository(Vaccine);
      const records = manager.getRepository(VaccinationRecord);
      const student = await students.findOne({ where: { id: dto.studentId } });
      if (!student) throw new NotFoundException('Student not found');

      const vaccine = await vaccines.findOne({ where: { id: dto.vaccineId } });
      if (!vaccine) throw new NotFoundException('Vaccine not found');
      if (vaccine.isArchived) throw new ConflictException('Archived vaccines cannot be used for new records');
      if (vaccine.stockQuantity < 1) throw new ConflictException('Vaccine is out of stock');

      vaccine.stockQuantity -= 1;
      await vaccines.save(vaccine);
      return records.save(
        records.create({
          student,
          vaccine,
          vaccinationDate: dto.vaccinationDate,
          doseNumber: dto.doseNumber,
          remarks: dto.remarks,
          administeredBy: { id: current.id } as User,
        }),
      );
    });
    return this.findOne(record.id, current);
  }

  findAll(current: AuthUser) {
    const where =
      current.role === Role.STUDENT ? { student: { user: { id: current.id } } } : {};
    return this.repo.find({ where, relations: RELATIONS, order: { id: 'ASC' } });
  }

  async findOne(id: number, current: AuthUser) {
    const record = await this.repo.findOne({ where: { id }, relations: RELATIONS });
    if (!record) throw new NotFoundException('Vaccination record not found');
    if (current.role === Role.STUDENT && record.student?.user?.id !== current.id) {
      throw new ForbiddenException('You can only view your own records');
    }
    return record;
  }

  async update(id: number, dto: UpdateVaccinationRecordDto, current: AuthUser) {
    const record = await this.findOne(id, current);
    Object.assign(record, dto);
    await this.repo.save(record);
    return this.findOne(id, current);
  }

  async remove(id: number, current: AuthUser) {
    const record = await this.findOne(id, current);
    const vaccine = await this.vaccines.findOne({ where: { id: record.vaccine.id } });
    if (vaccine) {
      vaccine.stockQuantity += 1; // return the dose to stock
      await this.vaccines.save(vaccine);
    }
    await this.repo.remove(record);
  }
}
