import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('settings')
export class Settings {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ default: 'THE NEST ARCHITECTS' })
  company_name: string;

  @Column({ default: 'jeyaamani99@gmail.com' })
  email: string;

  @Column({ nullable: true }) phone: string;
  @Column({ nullable: true }) facebook: string;
  @Column({ nullable: true }) instagram: string;
  @Column({ nullable: true }) linkedin: string;
  @Column({ nullable: true }) logo: string;
  @Column({ nullable: true }) favicon: string;
  @Column({ nullable: true }) footer_text: string;
  @Column({ nullable: true }) smtp_host: string;
  @Column({ nullable: true }) smtp_port: string;
  @Column({ nullable: true }) smtp_user: string;
  @Column({ nullable: true }) smtp_pass: string;
}
