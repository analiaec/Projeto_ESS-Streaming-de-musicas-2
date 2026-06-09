import { Entity, PrimaryGeneratedColumn, Column, ManyToOne,
  ManyToMany,
  JoinTable } from 'typeorm';
import {Artista} from '../artistas/artista.entity';
import { Album } from '../albuns/album.entity';
@Entity('musicas')
export class Musica {

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  titulo: string;

  @Column({ default: 0 })
  reproducoes: number;

  @Column({ nullable: true })
  arquivoUrl: string | null;

  @ManyToOne(() => Album, album => album.musicas, {nullable:false} )
  album: Album;

  // uma música pode ter vários artistas
  // e um artista pode ter várias músicas
  @ManyToMany(() => Artista, artista => artista.musicas)
  @JoinTable({ name: 'musica_artistas' }) // nome da tabela intermediária
  artistas: Artista[];
}