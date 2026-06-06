import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { User } from './entities/user.entity';
import { UserRole } from './entities/user.entity';

@Injectable()
export class DatabaseSeed implements OnModuleInit {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,) {}

  async onModuleInit() {
    const adminExists = await this.userRepository.findOne({where: {login: 'admin',},});
    if (!adminExists) {
      const admin = this.userRepository.create({
        login: 'admin',
        name: 'Administrador',
        password: 'admin123',
        email: 'admin@wave.com',
        tipodeconta: UserRole.ADMIN,
      });
      await this.userRepository.save(admin);
      console.log('Administrador padrão criado.');
    }
  }
}