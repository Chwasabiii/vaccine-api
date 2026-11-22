import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateVaccineDto } from './dto/create-vaccine.dto';
import { UpdateVaccineDto } from './dto/update-vaccine.dto';
import { Vaccine } from './entities/vaccine.entity';

@Injectable()
export class VaccinesService {
  constructor(@InjectRepository(Vaccine) private repo: Repository<Vaccine>) {}

  async create(dto: CreateVaccineDto) {
    if (await this.repo.findOne({ where: { vaccineName: dto.vaccineName } })) {
      throw new ConflictException('Vaccine already exists');
    }
    return this.repo.save(this.repo.create(dto));
  }

  findAll() {
    return this.repo.find({ order: { id: 'ASC' } });
  }

  async findOne(id: number) {
    const vaccine = await this.repo.findOne({ where: { id } });
    if (!vaccine) throw new NotFoundException('Vaccine not found');
    return vaccine;
  }

  async update(id: number, dto: UpdateVaccineDto) {
    const vaccine = await this.findOne(id);
    if (dto.vaccineName && dto.vaccineName !== vaccine.vaccineName) {
      if (await this.repo.findOne({ where: { vaccineName: dto.vaccineName } })) {
        throw new ConflictException('Vaccine already exists');
      }
    }
    Object.assign(vaccine, dto);
    return this.repo.save(vaccine);
  }

  async remove(id: number) {
    const vaccine = await this.findOne(id);
    await this.repo.remove(vaccine);
  }
}