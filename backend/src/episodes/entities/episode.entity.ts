import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, ManyToMany, JoinTable, CreateDateColumn} from 'typeorm';
import { Podcast } from '../../podcast/entities/podcast.entity';
import { Programa } from '../../programas/entities/programa.entity';
@Entity('episodes')
export class Episode {

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  titulo: string;

  @CreateDateColumn()
  ano: Date;

  @Column({ default: 0 })
  reproducoes: number;

  @ManyToOne(() => Programa, programa => programa.episodes, {nullable:false, onDelete: 'CASCADE'} )
  programa: Programa;

}