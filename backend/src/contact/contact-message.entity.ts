import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('contact_messages')
export class ContactMessage {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  email: string;

  @Column({ nullable: true })
  phone: string;

  @Column()
  subject: string;

  @Column('text')
  message: string;

  @Column({ default: false })
  is_read: boolean;

  @Column({ default: false })
  is_pinned: boolean;

  @CreateDateColumn()
  created_at: Date;
}
