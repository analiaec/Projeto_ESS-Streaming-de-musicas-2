import { Entity, PrimaryGeneratedColumn, Column, OneToMany, JoinTable,  ManyToOne, CreateDateColumn} from 'typeorm';
import { Podcast } from '../../podcast/entities/podcast.entity';
import { Episode } from '../../episodes/entities/episode.entity';

@Entity('Programa')
export class Programa {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  nome: string;

  @CreateDateColumn()
  data: Date;

  @Column('text', {array:true})
  generos: string[];

  @ManyToOne(() => Podcast, podcast => podcast.programa)
  podcast: Podcast;

  @OneToMany(() => Episode, episode => episode.programa, {cascade: true})
  episodes: Episode[];

}
