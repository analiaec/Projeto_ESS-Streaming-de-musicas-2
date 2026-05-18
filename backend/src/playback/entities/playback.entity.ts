import { Entity, PrimaryGeneratedColumn, ManyToOne, CreateDateColumn } from "typeorm";
import { User } from "../../users/entities/user.entity";
import { Musica } from "../../musicas/musica.entity";
import { Episode } from "../../episodes/entities/episode.entity";

@Entity('Playback')
export class Playback {
    @PrimaryGeneratedColumn()
    id: number;

    @CreateDateColumn()
    horario: Date;

    @ManyToOne(() => User)
    user: User;

    @ManyToOne(() => Musica, {nullable: true})
    musica?: Musica;

    @ManyToOne(() => Episode, {nullable: true})
    episode?: Episode;

}
