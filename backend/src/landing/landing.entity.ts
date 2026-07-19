import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('landing_page')
export class LandingPage {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  hero_image: string;

  @Column({ default: 'THE NEST ARCHITECTS' })
  company_name: string;

  @Column({ default: 'Designing Spaces. Creating Dreams.' })
  tagline: string;

  @Column('text', { nullable: true })
  overview: string;

  @Column('text', { nullable: true })
  mission: string;

  @Column('text', { nullable: true })
  vision: string;

  @Column({ default: 'Get Started' })
  cta_primary: string;

  @Column({ default: 'Sign in with Google' })
  cta_secondary: string;
}
