import { Column, CreateDateColumn, Entity, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Student } from '../../students/entities/student.entity';

export enum Role {
  ADMIN = 'admin',
  STAFF = 'staff',
  STUDENT = 'student',
}

@Entity('users')
export class User {
  @PrimaryGeneratedColumn() id: number;

  @Column({ unique: true, length: 150 }) email: string;

  @Column({ name: 'password_hash', length: 255, select: false }) passwordHash: string;

  @Column({ length: 100 }) name: string;

  @Column({ type: 'enum', enum: Role, default: Role.STUDENT }) role: Role;

  @CreateDateColumn({ name: 'created_at' }) createdAt: Date;

  @OneToOne(() => Student, (s) => s.user) student: Student;
}