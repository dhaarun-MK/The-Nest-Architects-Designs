import { Entity, PrimaryGeneratedColumn, Column, OneToMany, CreateDateColumn } from 'typeorm';
import { ProjectImage } from './project-image.entity';

@Entity('projects')
export class Project {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column('text')
  description: string;

  @Column()
  category: string;

  @Column()
  location: string;

  @Column('decimal', { precision: 12, scale: 2 })
  budget: number;

  @Column()
  duration: string;

  @Column({ nullable: true })
  cover_image: string;

  @Column({ nullable: true })
  client_name: string;

  @Column({ nullable: true })
  completed_date: string;

  @Column({ nullable: true })
  materials_used: string;

  @Column({ nullable: true })
  challenges: string;

  @Column({ nullable: true })
  before_image: string;

  @Column({ nullable: true })
  after_image: string;

  @Column({ nullable: true })
  testimonial: string;

  @Column({ default: true })
  is_featured: boolean;

  @Column({ default: 'active' })
  status: string;

  @OneToMany(() => ProjectImage, (img) => img.project, { cascade: true, eager: true })
  gallery: ProjectImage[];

  @CreateDateColumn()
  created_at: Date;
}
