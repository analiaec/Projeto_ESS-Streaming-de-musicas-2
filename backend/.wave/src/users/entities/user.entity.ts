import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

export enum UserRole{
  OUVINTE = 'OUVINTE',
  ARTISTA = 'ARTISTA',
  PODCAST = 'PODCAST'
}
@Entity()
export class User {
@PrimaryGeneratedColumn() //cria a chave primaria (Linha)
  "login": string;

  @Column() //cria a coluna nome
  "name": string;

  @Column()
 "password": string;

  @Column({"unique": true}) //cria a coluna email
  "email": string;

  @Column({type: 'enum', enum: UserRole})
  "role": UserRole;
}
