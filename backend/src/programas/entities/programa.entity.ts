import { Entity, PrimaryGeneratedColumn, Column,
  ManyToMany, OneToMany,
  JoinTable } from 'typeorm';
import { Podcast } from '../../podcast/entities/podcast.entity';
import { Episode } from '../../episodes/entities/episode.entity';

@Entity('Programa')
export class Programa {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  nome: string;

  @Column()
  data: string;

  @Column('text', {array:true})
  generos: string[];

  @ManyToMany(() => Podcast, podcast => podcast.programa)
  podcasts: Podcast[];

  @OneToMany(() => Episode, episode => episode.programa, {cascade: true})
  episodes: Episode[];

}
