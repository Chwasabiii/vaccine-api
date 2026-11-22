import {
  Body, Controller, Delete, Get, HttpCode, Param,
  ParseIntPipe, Patch, Post, Query, UseGuards,
} from '@nestjs/common';
import { Roles } from '../auth/decorators/roles.decorator';
import { JwtAuthGuard } from '../auth/guard/jwt-auth.guard';
import { RolesGuard } from '../auth/guard/roles.guard';
import { Role } from '../users/entities/user.entity';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';
import { StudentsService } from './students.service';

@Controller('students')
@UseGuards(JwtAuthGuard, RolesGuard)
export class StudentsController {
  constructor(private readonly students: StudentsService) {}

  @Post()
  @Roles(Role.ADMIN, Role.STAFF)
  create(@Body() dto: CreateStudentDto) {
    return this.students.create(dto);
  }

  @Get()
  @Roles(Role.ADMIN, Role.STAFF)
  findAll(@Query('course') course?: string, @Query('yearLevel') yearLevel?: string) {
    return this.students.findAll(course, yearLevel ? +yearLevel : undefined);
  }

  @Get(':id')
  @Roles(Role.ADMIN, Role.STAFF)
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.students.findOne(id);
  }

  @Patch(':id')
  @Roles(Role.ADMIN, Role.STAFF)
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateStudentDto) {
    return this.students.update(id, dto);
  }

  @Delete(':id')
  @Roles(Role.ADMIN)
  @HttpCode(204)
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.students.remove(id);
  }
}