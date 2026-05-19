import { Injectable, NotFoundException } from '@nestjs/common';
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
    const newUser = this.usersRepository.create(createUserDto) //assim usa o dto com a entidade
    return await this.usersRepository.save(newUser) //save faz insert no banco de dados
  }

  findAll() {
    return this.usersRepository.find()
  }

  async findByLogin(login: string) {
    // findOneBy retorna o usuário OU null se não encontrar, sem jogar erros!
    return await this.usersRepository.findOneBy({ login });
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

  async remove(login: string) {
   const removedUser = await this.findOne(login) //acha o login do usuario pra remover
   await this.usersRepository.remove(removedUser)
   return removedUser //retorna o id do usuario removido
  }
}
