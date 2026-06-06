import { Entity, PrimaryColumn, Column, OneToMany } from 'typeorm';
import { Playback } from '../../playback/entities/playback.entity';

export enum UserRole{
  OUVINTE = 'OUVINTE',
  ARTISTA = 'ARTISTA',
  PODCASTER = 'PODCASTER',
  ADMIN = 'ADMIN'
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
  "tipodeconta": UserRole;

}
