import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { ProjectTypeService } from './project-type-service.entity';

@Entity('project_types')
export class ProjectType {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  name: string;

  @OneToMany(() => ProjectTypeService, (s) => s.projectType, { cascade: true, eager: true })
  services: ProjectTypeService[];
}
