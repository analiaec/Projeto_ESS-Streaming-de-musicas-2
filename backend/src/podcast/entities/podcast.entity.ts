import { Entity, Column, OneToMany } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Episode } from '../../episodes/entities/episode.entity';

@Entity('podcast')
export class Podcast extends User {
  // descricao publica do canal de podcast
  @Column()
  descricao: string;

  // um podcast pode ter varios episodios
  @OneToMany(() => Episode, episode => episode.podcast)
  episodes: Episode[];
}