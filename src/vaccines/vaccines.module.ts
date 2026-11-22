import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VaccinesService } from './vaccines.service';
import { VaccinesController } from './vaccines.controller';
import { Vaccine } from './entities/vaccine.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Vaccine])],
  controllers: [VaccinesController],
  providers: [VaccinesService],
  exports: [TypeOrmModule, VaccinesService],
})
export class VaccinesModule {}