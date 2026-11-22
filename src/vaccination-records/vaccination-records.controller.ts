import {
  Body, Controller, Delete, Get, HttpCode, Param,
  ParseIntPipe, Patch, Post, Req, UseGuards,
} from '@nestjs/common';
import { Roles } from '../auth/decorators/roles.decorator';
import { JwtAuthGuard } from '../auth/guard/jwt-auth.guard';
import { RolesGuard } from '../auth/guard/roles.guard';
import { Role } from '../users/entities/user.entity';
import { CreateVaccinationRecordDto } from './dto/create-vaccination-record.dto';
import { UpdateVaccinationRecordDto } from './dto/update-vaccination-record.dto';
import { VaccinationRecordsService } from './vaccination-records.service';

@Controller('vaccination-records')
@UseGuards(JwtAuthGuard, RolesGuard)
export class VaccinationRecordsController {
  constructor(private readonly records: VaccinationRecordsService) {}

  @Post()
  @Roles(Role.ADMIN, Role.STAFF)
  create(@Body() dto: CreateVaccinationRecordDto, @Req() req: any) {
    return this.records.create(dto, req.user);
  }

  @Get()
  findAll(@Req() req: any) {
    return this.records.findAll(req.user);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number, @Req() req: any) {
    return this.records.findOne(id, req.user);
  }

  @Patch(':id')
  @Roles(Role.ADMIN, Role.STAFF)
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateVaccinationRecordDto,
    @Req() req: any,
  ) {
    return this.records.update(id, dto, req.user);
  }

  @Delete(':id')
  @Roles(Role.ADMIN)
  @HttpCode(204)
  remove(@Param('id', ParseIntPipe) id: number, @Req() req: any) {
    return this.records.remove(id, req.user);
  }
}