import { Module } from '@nestjs/common';
import { PlaybackService } from './playback.service';
import { PlaybackController } from './playback.controller';

@Module({
  controllers: [PlaybackController],
  providers: [PlaybackService],
})
export class PlaybackModule {}
