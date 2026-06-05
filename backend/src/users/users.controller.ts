import { Controller, Get, Post, Body, Patch, Param, Delete, Request, ForbiddenException } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { UserRole } from './entities/user.entity';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get()
  @UseGuards(JwtAuthGuard) //serve pra dizer que precisa de token
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':login')
  @UseGuards(JwtAuthGuard)
  findOne(@Param('login') login: string) {
    return this.usersService.findOne(login);
  }

  @Patch(':login/promote')
  @UseGuards(JwtAuthGuard)
  promote(@Param('login') login: string, @Request() req,) {
    if (req.user.role !== UserRole.ADMIN) {throw new ForbiddenException('Apenas administradores podem promover usuários.');}
    return this.usersService.promote(login);
  }

  @Patch(':login')
  @UseGuards(JwtAuthGuard)
  update(@Param('login') login: string, @Body() updateUserDto: UpdateUserDto, @Request() req) {
    if (req.user.login !== login && req.user.role !== UserRole.ADMIN) {throw new ForbiddenException('Você não possui permissão para realizar esta ação.',);}
    if(req.user.login !== UserRole.ADMIN && updateUserDto.role === UserRole.ADMIN){throw new ForbiddenException('Você não pode promover a própria conta para admin.');}
    return this.usersService.update(login, updateUserDto);
  }

  @Delete(':login')
  @UseGuards(JwtAuthGuard)
  remove(@Param('login') login: string, @Request() req, ) {
    if (req.user.login !== login && req.user.role !== UserRole.ADMIN) {throw new ForbiddenException('Você não possui permissão para realizar esta ação.',);}
    return this.usersService.remove(login);
  }
}
