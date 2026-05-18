import { Entity, PrimaryGeneratedColumn, Column, ManyToOne,
  ManyToMany,
  JoinTable } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Programa } from '../../programas/entities/programa.entity';
import { Episode } from '../../episodes/entities/episode.entity';

@Entity('podcast')
export class Podcast extends User {
    @Column() 
    descricao: string;

    @ManyToMany(() => Programa, programa => programa.podcast)
    programa: Programa[];
}