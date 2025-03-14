import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from 'typeorm';
import { User } from '../users/user.entity';
import { Account } from '../accounts/account.entity';

@Entity()
export class Transaction {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  amount: number;

  @Column()
  type: string; // deposit, withdrawal, transfer

  @CreateDateColumn()
  createdAt: Date;

  @ManyToOne(() => User, user => user.transactions, { eager: true })
  user: User;

  @ManyToOne(() => Account, account => account.transactions, { eager: true })
  account: Account;
}
