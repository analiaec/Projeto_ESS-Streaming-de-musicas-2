import { Entity, PrimaryGeneratedColumn, Column, ManyToOne,
  ManyToMany,
  JoinTable } from 'typeorm';
import { Podcast } from '../../podcast/entities/podcast.entity';
import { Programa } from '../../programas/entities/programa.entity';
@Entity('episodes')
export class Episode {

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  titulo: string;

  @Column()
  genero: string;

  @Column()
  ano: number;

  @Column({ default: 0 })
  reproducoes: number;

  @ManyToOne(() => Programa, programa => programa.episodes, {nullable:false} )
  programa: Programa;

  // uma música pode ter vários artistas
  // e um artista pode ter várias músicas
  @ManyToMany(() => Podcast, podcast => podcast.episode)
  @JoinTable({ name: 'episode_podcasts' }) // nome da tabela intermediária
  podcasts: Podcast[];
}