import {
  ConflictException, Injectable, NotFoundException, OnModuleInit, UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { DataSource, Repository } from 'typeorm';
import { Student } from '../students/entities/student.entity';
import { Role, User } from '../users/entities/user.entity';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

@Injectable()
export class AuthService implements OnModuleInit {
  constructor(
    @InjectRepository(User) private users: Repository<User>,
    private dataSource: DataSource,
    private jwt: JwtService,
    private config: ConfigService,
  ) {}

  // creates the first admin from .env if it does not exist
  async onModuleInit() {
    const email = this.config.get<string>('ADMIN_EMAIL');
    const password = this.config.get<string>('ADMIN_PASSWORD');
    if (!email || !password) return;
    if (await this.users.findOne({ where: { email } })) return;
    await this.users.save(
      this.users.create({
        email,
        name: 'Administrator',
        role: Role.ADMIN,
        passwordHash: await bcrypt.hash(password, 10),
      }),
    );
  }

  async register(dto: RegisterDto) {
    return this.dataSource.transaction(async (manager) => {
      const users = manager.getRepository(User);
      const students = manager.getRepository(Student);
      if (await users.findOne({ where: { email: dto.email } })) {
        throw new ConflictException('Email already registered');
      }
      const student = await students.findOne({ where: { studentNo: dto.studentNo }, relations: { user: true } });
      if (!student) throw new NotFoundException('Student number was not found. Ask your school to add you to the student roster.');
      if (student.user) throw new ConflictException('This student number already has an account');

      const user = users.create({
        email: dto.email,
        name: dto.name,
        role: Role.STUDENT,
        passwordHash: await bcrypt.hash(dto.password, 10),
      });
      await users.save(user);
      student.user = user;
      await students.save(student);
      return { id: user.id, email: user.email, name: user.name, role: user.role, createdAt: user.createdAt };
    });
  }

  async login(dto: LoginDto) {
    const user = await this.users
      .createQueryBuilder('u')
      .addSelect('u.passwordHash')
      .where('u.email = :email', { email: dto.email })
      .getOne();

    if (!user || !(await bcrypt.compare(dto.password, user.passwordHash))) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const accessToken = await this.jwt.signAsync({
      sub: user.id,
      email: user.email,
      role: user.role,
    });
    return { accessToken };
  }

  async me(id: number) {
    const user = await this.users.findOne({ where: { id } });
    if (!user) throw new UnauthorizedException();
    return { id: user.id, email: user.email, name: user.name, role: user.role, createdAt: user.createdAt };
  }
}
