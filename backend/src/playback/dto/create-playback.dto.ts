import {IsInt,IsOptional, IsString, Length} from 'class-validator';

export class CreatePlaybackDto {
    @IsString()
    @Length(3,20)
    login: string

    @IsOptional()
    @IsInt()
    musicaid?: number;

    @IsOptional()
    @IsInt()
    episodeid?: number;
}
