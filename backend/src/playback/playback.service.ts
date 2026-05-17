import { Injectable } from '@nestjs/common';
import { CreatePlaybackDto } from './dto/create-playback.dto';
import { UpdatePlaybackDto } from './dto/update-playback.dto';

@Injectable()
export class PlaybackService {
  create(createPlaybackDto: CreatePlaybackDto) {
    return 'This action adds a new playback';
  }

  findAll() {
    return `This action returns all playback`;
  }

  findOne(id: number) {
    return `This action returns a #${id} playback`;
  }

  update(id: number, updatePlaybackDto: UpdatePlaybackDto) {
    return `This action updates a #${id} playback`;
  }

  remove(id: number) {
    return `This action removes a #${id} playback`;
  }
}
