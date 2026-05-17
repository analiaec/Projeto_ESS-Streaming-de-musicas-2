import { PartialType } from '@nestjs/mapped-types';
import { CreatePlaybackDto } from './create-playback.dto';

export class UpdatePlaybackDto extends PartialType(CreatePlaybackDto) {}
