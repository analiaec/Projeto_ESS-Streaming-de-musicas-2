import { Entity, PrimaryColumn, Column } from 'typeorm';

export enum UserRole{
  OUVINTE = 'OUVINTE',
  ARTISTA = 'ARTISTA',
  PODCAST = 'PODCAST'
}
@Entity('users')
export class User {
  @PrimaryColumn() //cria a chave primaria (Linha)
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
