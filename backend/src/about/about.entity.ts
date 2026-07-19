import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('about_page')
export class AboutPage {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('text', { nullable: true })
  overview: string;

  @Column('text', { nullable: true })
  mission: string;

  @Column('text', { nullable: true })
  vision: string;

  @Column('text', { nullable: true })
  history: string;

  @Column('text', { nullable: true })
  achievements: string;

  @Column('jsonb', { nullable: true, default: [] })
  team_members: { name: string; role: string; img: string }[];
}
