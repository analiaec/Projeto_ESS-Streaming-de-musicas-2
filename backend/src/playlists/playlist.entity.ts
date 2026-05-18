import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('playlists')
export class Playlist {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  nome: string;

  @Column({ nullable: true })
  descricao?: string;

  @Column({ default: true })
  publica: boolean;

  @Column()
  ownerLogin: string;
}
