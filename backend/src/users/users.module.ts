import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { DatabaseSeed } from './database.seed';

@Module({
  imports: [TypeOrmModule.forFeature([User])], //diz ao nest pra usar o repositorio da entidade User
  controllers: [UsersController],
  providers: [UsersService, DatabaseSeed],
  exports: [UsersService]
})
export class UsersModule {}
