import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from 'typeorm';
import { Podcast } from '../../podcast/entities/podcast.entity';
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

  // caminho/url do audio bruto pra download
  @Column({ nullable: true })
  arquivoUrl: string;

  // data opcional pra postar episodio no futuro
  @Column({ type: 'timestamp', nullable: true })
  dataPublicacaoAgendada: Date | null;

  // flag pra esconder episodio ate publicar
  @Column({ default: true })
  publicado: boolean;

  // quando ele virou publico de fato
  @Column({ type: 'timestamp', nullable: true })
  publicadoEm: Date | null;

  // episodio pertence a um podcast
  @ManyToOne(() => Podcast, podcast => podcast.episodes, { nullable: false, onDelete: 'CASCADE' })
  podcast: Podcast;

}