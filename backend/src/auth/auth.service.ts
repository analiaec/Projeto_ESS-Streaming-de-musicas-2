import { ConflictException, Injectable } from "@nestjs/common";
import { UsersService } from "../users/users.service";
import { RegisterDto } from "./dto/register.dto";

@Injectable()
export class AuthService{
    constructor(private readonly usersService: UsersService,){}

    async register(registerDto: RegisterDto){
        const usere = await this.usersService.findByLogin(registerDto.login); //verificar se ja existe usuario com esse login
        if(usere){throw new ConflictException('Já existe uma conta com esse Login. Use outro Login.');}
        const user = await this.usersService.create(registerDto);
        return {message: 'Seja bem-vindo ao .WAVe.', user,}
    }
}