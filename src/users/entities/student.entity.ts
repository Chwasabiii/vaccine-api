import {
  Column, CreateDateColumn, Entity, JoinColumn,
  OneToMany, OneToOne, PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { VaccinationRecord } from '../../vaccination-records/entities/vaccination-record.entity';

@Entity('students')
export class Student {
  @PrimaryGeneratedColumn() id: number;

  @OneToOne(() => User, (u) => u.student, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ name: 'student_no', unique: true, length: 30 }) studentNo: string;

  @Column({ nullable: true, length: 100 }) course: string;

  @Column({ name: 'year_level', type: 'int', nullable: true }) yearLevel: number;

  @Column({ nullable: true, length: 50 }) contact: string;

  @CreateDateColumn({ name: 'created_at' }) createdAt: Date;

  @OneToMany(() => VaccinationRecord, (r) => r.student) records: VaccinationRecord[];
}