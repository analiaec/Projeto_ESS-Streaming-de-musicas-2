import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, JoinTable } from 'typeorm';
import { Musica } from '../musicas/musica.entity';

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

  @Column({ nullable: true })
  categoria?: string;

  @Column({ type: 'text', array: true, default: () => "ARRAY[]::text[]" })
  seguidores: string[];

  @ManyToMany(() => Musica)
  @JoinTable({ name: 'playlist_musicas' })
  musicas: Musica[];
}
