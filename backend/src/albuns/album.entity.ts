import { Entity, PrimaryGeneratedColumn, Column,
  ManyToMany, OneToMany,
  JoinTable } from 'typeorm';
import {Musica} from '../musicas/musica.entity';
import {Artista} from '../artistas/artista.entity';

@Entity('albuns')
export class Album {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  nome: string;

  @Column()
  data: string;

  @Column('text', {array:true})
  generos: string[];

  @ManyToMany(() => Artista, artista => artista.albuns)
  artistas: Artista[];

  @OneToMany(() => Musica, musica => musica.album, {cascade: true})
  musicas: Musica[];

  @Column({ nullable: true })
  imageUrl?: string;

}