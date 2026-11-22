import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(@InjectRepository(User) private repo: Repository<User>) {}

  private clean(u: User) {
    const { passwordHash, ...safe } = u;
    return safe;
  }

  async create(dto: CreateUserDto) {
    if (await this.repo.findOne({ where: { email: dto.email } })) {
      throw new ConflictException('Email already registered');
    }
    const user = await this.repo.save(
      this.repo.create({
        email: dto.email,
        name: dto.name,
        role: dto.role,
        passwordHash: await bcrypt.hash(dto.password, 10),
      }),
    );
    return this.clean(user);
  }

  findAll() {
    return this.repo.find(); // passwordHash is select:false
  }

  async findOne(id: number) {
    const user = await this.repo.findOne({ where: { id } });
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async update(id: number, dto: UpdateUserDto) {
    const user = await this.findOne(id);
    if (dto.email && dto.email !== user.email) {
      if (await this.repo.findOne({ where: { email: dto.email } })) {
        throw new ConflictException('Email already registered');
      }
    }
    const { password, ...rest } = dto;
    Object.assign(user, rest);
    if (password) user.passwordHash = await bcrypt.hash(password, 10);
    return this.clean(await this.repo.save(user));
  }

  async remove(id: number) {
    const user = await this.findOne(id);
    await this.repo.remove(user);
  }
}