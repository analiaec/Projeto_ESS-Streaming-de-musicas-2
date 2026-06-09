import { Injectable, NotFoundException, UnauthorizedException, ConflictException, BadRequestException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { RemoveUserDto } from './dto/remove-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';

const FIELD_NAMES: Record<string, string> = {
  password: 'senha',
  name: 'nome',
  tipodeconta: 'tipo de conta',
};

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const emailExiste = await this.usersRepository.findOneBy({ email: createUserDto.email });
    if (emailExiste) throw new ConflictException('Já existe uma conta com esse e-mail.');
    const newUser = this.usersRepository.create(createUserDto);
    return await this.usersRepository.save(newUser);
  }

  findAll() {
    return this.usersRepository.find();
  }

  async findByLogin(login: string) {
    return await this.usersRepository.findOneBy({ login });
  }

  async findByEmail(email: string) {
    return await this.usersRepository.findOneBy({ email });
  }

  async findOne(login: string) {
    const user = await this.usersRepository.findOneBy({ login });
    if (!user) { throw new NotFoundException('User not found'); }
    return user;
  }

  async update(login: string, updateUserDto: UpdateUserDto) {
    const user = await this.findOne(login);

    const filledFields = Object.entries(updateUserDto).filter(([, v]) => v !== undefined);
    if (filledFields.length === 0) {
      throw new BadRequestException('Não é possível realizar uma atualização sem preencher nenhum campo.');
    }

    const sameFields = filledFields
      .filter(([k, v]) => user[k] === v)
      .map(([k]) => FIELD_NAMES[k] ?? k);

    if (sameFields.length === filledFields.length) {
      throw new BadRequestException(
        `Não é possível atualizar os seguintes campos com o mesmo valor atual: ${sameFields.join(', ')}.`,
      );
    }

    Object.assign(user, updateUserDto);
    const savedUser = await this.usersRepository.save(user);
    return { message: 'Dados atualizados com sucesso.', user: savedUser };
  }

  async remove(login: string, removeUserDto?: RemoveUserDto) {
    const removedUser = await this.findOne(login);
    if (removeUserDto?.password !== undefined && removedUser.password !== removeUserDto.password) {
      throw new UnauthorizedException('Senha incorreta. Insira a senha correta para realizar a remoção da conta.');
    }
    await this.usersRepository.remove(removedUser);
    return { message: 'A conta foi removida do sistema com sucesso.', user: removedUser };
  }

}
