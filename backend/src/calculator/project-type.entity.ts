import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('project_types')
export class ProjectType {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  name: string;
}
