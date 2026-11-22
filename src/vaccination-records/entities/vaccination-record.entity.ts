import { Check, Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Student } from '../../students/entities/student.entity';
import { Vaccine } from '../../vaccines/entities/vaccine.entity';
import { User } from '../../users/entities/user.entity';

@Entity('vaccination_records')
@Check('dose_number > 0')
export class VaccinationRecord {
  @PrimaryGeneratedColumn() id: number;

  @ManyToOne(() => Student, (s) => s.records, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'student_id' })
  student: Student;

  @ManyToOne(() => Vaccine, (v) => v.records, { nullable: false })
  @JoinColumn({ name: 'vaccine_id' })
  vaccine: Vaccine;

  @Column({ name: 'vaccination_date', type: 'date' }) vaccinationDate: string;

  @Column({ name: 'dose_number', type: 'int' }) doseNumber: number;

  @ManyToOne(() => User, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'administered_by' })
  administeredBy: User;

  @Column({ type: 'text', nullable: true }) remarks: string;
}