import {
  Check, Column, CreateDateColumn, Entity,
  OneToMany, PrimaryGeneratedColumn, UpdateDateColumn,
} from 'typeorm';
import { VaccinationRecord } from '../../vaccination-records/entities/vaccination-record.entity';

@Entity('vaccines')
@Check('stock_quantity >= 0')
export class Vaccine {
  @PrimaryGeneratedColumn() id: number;

  @Column({ name: 'vaccine_name', unique: true, length: 100 }) vaccineName: string;

  @Column({ type: 'text', nullable: true }) description: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 }) price: number;

  @Column({ name: 'stock_quantity', type: 'int', default: 0 }) stockQuantity: number;

  @Column({ name: 'reorder_level', type: 'int', default: 0 }) reorderLevel: number;

  @Column({ name: 'is_archived', type: 'boolean', default: false }) isArchived: boolean;

  @CreateDateColumn({ name: 'created_at' }) createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' }) updatedAt: Date;

  @OneToMany(() => VaccinationRecord, (r) => r.vaccine) records: VaccinationRecord[];
}
