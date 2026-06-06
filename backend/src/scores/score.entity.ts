import { Entity, ManyToOne, Column, 
         PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { User }   from '../users/entities/user.entity';
import { Musica } from '../musicas/musica.entity';

@Entity('scores')
export class Score {

  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, { nullable: false , onDelete: 'CASCADE' })
  user: User;

  @ManyToOne(() => Musica, { nullable: false, onDelete: 'CASCADE'  })
  musica: Musica;

  @Column({ type: 'float' })
  score: number; // valor entre 0 e 1

  @UpdateDateColumn()
  atualizadoEm: Date;
}