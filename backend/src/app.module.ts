import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { MusicasModule } from './musicas/musicas.module';
import { PlaylistsModule } from './playlists/playlists.module';
import { PodcastModule } from './podcast/podcast.module';
import { ProgramasModule } from './programas/programas.module';
import { EpisodesModule } from './episodes/episodes.module';
import { PlaybackModule } from './playback/playback.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { ScoresModule } from './scores/score.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),

    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST ?? 'localhost',
      port: parseInt(process.env.DB_PORT ?? '5432'),
      username: process.env.DB_USER ?? 'postgres',
      password: process.env.DB_PASS ?? 'postgres',
      database: process.env.DB_NAME ?? 'streaming',
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true,
    }),
    MusicasModule,
    PlaylistsModule,
    PodcastModule,
    ProgramasModule,
    EpisodesModule,
    PlaybackModule,
    UsersModule,
    AuthModule,
    ScoresModule,
  ],
})
export class AppModule {}