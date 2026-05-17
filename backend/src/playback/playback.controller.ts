import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { PlaybackService } from './playback.service';
import { CreatePlaybackDto } from './dto/create-playback.dto';
import { UpdatePlaybackDto } from './dto/update-playback.dto';

@Controller('playback')
export class PlaybackController {
  constructor(private readonly playbackService: PlaybackService) {}

  @Post()
  create(@Body() createPlaybackDto: CreatePlaybackDto) {
    return this.playbackService.create(createPlaybackDto);
  }

  @Get()
  findAll() {
    return this.playbackService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.playbackService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePlaybackDto: UpdatePlaybackDto) {
    return this.playbackService.update(+id, updatePlaybackDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.playbackService.remove(+id);
  }
}
