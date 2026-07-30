import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { ProjectType } from './project-type.entity';

@Entity('project_type_services')
export class ProjectTypeService {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column('decimal', { precision: 10, scale: 2 })
  price_per_sqft: number;

  @Column({ default: 0 })
  discount: number;

  @Column({ default: true })
  is_visible: boolean;

  @Column({ nullable: true })
  category: string;

  @ManyToOne(() => ProjectType, (pt) => pt.services, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'project_type_id' })
  projectType: ProjectType;

  @Column()
  project_type_id: number;
}
