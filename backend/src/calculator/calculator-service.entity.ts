import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('calculator_services')
export class CalculatorService {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  service: string;

  @Column('decimal', { precision: 10, scale: 2 })
  price_per_sqft: number;

  @Column({ type: 'jsonb', nullable: true, default: {} })
  project_type_pricing: Record<string, number>;

  @Column({ nullable: true })
  category: string;

  @Column({ default: 0 })
  discount: number;

  @Column({ default: true })
  is_visible: boolean;
}
