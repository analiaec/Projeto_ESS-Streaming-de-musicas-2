import { ConflictException, Injectable, UnauthorizedException } from "@nestjs/common";
import { UsersService } from "../users/users.service";
import { RegisterDto } from "./dto/register.dto";
import { LoginDto } from "./dto/login.dto";
import { JwtService } from '@nestjs/jwt';
import { User, UserRole } from "../users/entities/user.entity";

@Injectable()
export class AuthService{
    constructor(private readonly usersService: UsersService, 
                private readonly jwtService: JwtService,){}

    async register(registerDto: RegisterDto){
        const usere = await this.usersService.findByLogin(registerDto.login); //verificar se ja existe usuario com esse login
        if(usere){throw new ConflictException('Já existe uma conta com esse Login. Use outro Login.');}
        const users = await this.usersService.findAll();
        if(registerDto.tipodeconta === UserRole.ADMIN){throw new UnauthorizedException('Voce nao possui permissão para se tornar um admin.');}
        const user = await this.usersService.create(registerDto);
        return {message: 'Seja bem-vindo ao .WAVe.', user,}
    }
    async login(loginDto: LoginDto) {
    const user = await this.usersService.findByLogin(loginDto.login);
    if (!user) {throw new UnauthorizedException('Login ou senha inválidos');}
    if (user.password !== loginDto.password) {throw new UnauthorizedException('Login ou senha inválidos.');}
    const payload = {
    sub: user.login,
    role: user.tipodeconta,
  };
  return {
    access_token: this.jwtService.sign(payload),
    role: user.tipodeconta
  };
    }
}