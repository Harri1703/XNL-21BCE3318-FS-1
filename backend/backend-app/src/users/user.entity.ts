import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Account } from '../accounts/account.entity';
import { Transaction } from '../transactions/transaction.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({ default: 'user' }) // ✅ Default role is 'user'
  role: string;

  @OneToMany(() => Account, account => account.user)
  accounts: Account[];

  @OneToMany(() => Transaction, transaction => transaction.user)
  transactions: Transaction[];
}
