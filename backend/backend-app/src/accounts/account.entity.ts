import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from 'typeorm';
import { User } from '../users/user.entity';
import { Transaction } from '../transactions/transaction.entity';

@Entity()
export class Account {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  accountNumber: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  balance: number;

  @ManyToOne(() => User, user => user.accounts)
  user: User;

  @OneToMany(() => Transaction, transaction => transaction.account)
  transactions: Transaction[];
}
