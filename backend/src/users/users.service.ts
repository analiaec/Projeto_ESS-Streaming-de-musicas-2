import { Injectable, NotFoundException, UnauthorizedException, ConflictException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User, UserRole } from './entities/user.entity';
@Injectable()
export class UsersService {
  constructor(
  @InjectRepository(User)
  private usersRepository: Repository<User>,) {}

  async create(createUserDto: CreateUserDto) {
    const emailExiste = await this.usersRepository.findOneBy({ email: createUserDto.email });
    if (emailExiste) throw new ConflictException('Já existe uma conta com esse e-mail.');
    const newUser = this.usersRepository.create(createUserDto);
    return await this.usersRepository.save(newUser);
  }

  findAll() {
    return this.usersRepository.find()
  }

  async findByLogin(login: string) {
    return await this.usersRepository.findOneBy({ login });
  }

  async findByEmail(email: string) {
    return await this.usersRepository.findOneBy({ email });
  }

  async findOne(login: string) {
    const user = await this.usersRepository.findOneBy({login})
        if(!user){throw new NotFoundException('User not found')}
        return user
  }

  async update(login: string, updateUserDto: UpdateUserDto) {
    const user = await this.findOne(login) //garante que o usuario existe ou lanca notfoundexception
    Object.assign(user,updateUserDto) //sobreescreve os campos enviados
    return this.usersRepository.save(user) //faz update em vez de insert pois o typeorm percebe que o objeto ja tem id
  }

  async remove(login: string, password?: string) {
    const removedUser = await this.findOne(login);
    if (password !== undefined && removedUser.password !== password) {
      throw new UnauthorizedException('Senha incorreta.');
    }
    await this.usersRepository.remove(removedUser);
    return removedUser;
  }
  async promote(login: string) {
    const user = await this.findOne(login);
    user.tipodeconta = UserRole.ADMIN;
    return this.usersRepository.save(user);
  }
}
