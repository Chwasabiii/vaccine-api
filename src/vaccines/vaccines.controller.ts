import {
  Body, Controller, Delete, Get, HttpCode, Param,
  ParseIntPipe, Patch, Post, Req, UseGuards,
} from '@nestjs/common';
import { Roles } from '../auth/decorators/roles.decorator';
import { JwtAuthGuard } from '../auth/guard/jwt-auth.guard';
import { RolesGuard } from '../auth/guard/roles.guard';
import { Role } from '../users/entities/user.entity';
import { CreateVaccineDto } from './dto/create-vaccine.dto';
import { UpdateVaccineDto } from './dto/update-vaccine.dto';
import { VaccinesService } from './vaccines.service';

@Controller('vaccines')
@UseGuards(JwtAuthGuard, RolesGuard)
export class VaccinesController {
  constructor(private readonly vaccines: VaccinesService) {}

  @Post()
  @Roles(Role.ADMIN, Role.STAFF)
  create(@Body() dto: CreateVaccineDto) {
    return this.vaccines.create(dto);
  }

  @Get()
  findAll(@Req() req: any) {
    return this.vaccines.findAll(req.user);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.vaccines.findOne(id);
  }

  @Patch(':id')
  @Roles(Role.ADMIN, Role.STAFF)
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateVaccineDto) {
    return this.vaccines.update(id, dto);
  }

  @Delete(':id')
  @Roles(Role.ADMIN)
  @HttpCode(204)
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.vaccines.remove(id);
  }
}
