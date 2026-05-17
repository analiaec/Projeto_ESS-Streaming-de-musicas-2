import { Controller, Get, Post, Body, Param} from '@nestjs/common';
import { PlaybackService } from './playback.service';
import { CreatePlaybackDto } from './dto/create-playback.dto';

@Controller('users/:login/playback')
export class PlaybackController {
  constructor(private readonly playbackService: PlaybackService) {}

  @Post() //cria playbacks
  create(@Body() createPlaybackDto: CreatePlaybackDto) {
    return this.playbackService.create(createPlaybackDto);
  }

  @Get()
  findByUser(@Param('login') login:string,){
    return this.playbackService.findByUser(login);
  }

  @Get(':id')
  findOne(@Param('login') login: string, @Param('id') id: number) {
    return this.playbackService.findOne(login, id,);
  }

}
