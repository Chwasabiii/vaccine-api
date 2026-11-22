import { IsInt, IsOptional, IsString, Max, MaxLength, Min } from 'class-validator';

export class CreateStudentDto {
  @IsString() @MaxLength(30) studentNo: string;
  @IsOptional() @IsString() @MaxLength(100) course?: string;
  @IsOptional() @IsInt() @Min(1) @Max(6) yearLevel?: number;
  @IsOptional() @IsString() @MaxLength(50) contact?: string;
  @IsOptional() @IsInt() userId?: number;
}