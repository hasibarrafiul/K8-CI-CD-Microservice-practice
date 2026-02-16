import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('credentials') // This table belongs only to Auth
export class AuthCredential {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string; // The hashed password
}