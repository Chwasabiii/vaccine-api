import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';
import { Student } from './entities/student.entity';

@Injectable()
export class StudentsService {
  constructor(
    @InjectRepository(Student) private repo: Repository<Student>,
    @InjectRepository(User) private users: Repository<User>,
  ) {}

  async create(dto: CreateStudentDto) {
    if (await this.repo.findOne({ where: { studentNo: dto.studentNo } })) {
      throw new ConflictException('Student number already exists');
    }
    const { userId, ...rest } = dto;
    const student = this.repo.create(rest);
    if (userId) {
      const user = await this.users.findOne({ where: { id: userId } });
      if (!user) throw new NotFoundException('User not found');
      student.user = user;
    }
    return this.repo.save(student);
  }

  findAll(course?: string, yearLevel?: number) {
    const where: FindOptionsWhere<Student> = {};
    if (course) where.course = course;
    if (yearLevel) where.yearLevel = yearLevel;
    return this.repo.find({ where, relations: { user: true }, order: { id: 'ASC' } });
  }

  async findOne(id: number) {
    const student = await this.repo.findOne({ where: { id }, relations: { user: true } });
    if (!student) throw new NotFoundException('Student not found');
    return student;
  }

  async update(id: number, dto: UpdateStudentDto) {
    const student = await this.findOne(id);
    if (dto.studentNo && dto.studentNo !== student.studentNo) {
      if (await this.repo.findOne({ where: { studentNo: dto.studentNo } })) {
        throw new ConflictException('Student number already exists');
      }
    }
    const { userId, ...rest } = dto;
    Object.assign(student, rest);
    if (userId) {
      const user = await this.users.findOne({ where: { id: userId } });
      if (!user) throw new NotFoundException('User not found');
      student.user = user;
    }
    return this.repo.save(student);
  }

  async remove(id: number) {
    const student = await this.findOne(id);
    await this.repo.remove(student);
  }
}