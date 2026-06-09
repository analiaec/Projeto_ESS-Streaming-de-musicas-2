import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { UsersService } from './users.service';
import { User, UserRole } from './entities/user.entity';
import { NotFoundException, UnauthorizedException } from '@nestjs/common';
import { RemoveUserDto } from './dto/remove-user.dto';

const mockRepository = {
  find: jest.fn(),
  findOne: jest.fn(),
  findOneBy: jest.fn(),
  save: jest.fn(),
  remove: jest.fn(),
  create: jest.fn(),
};

describe('UsersService', () => {
let service: UsersService;

beforeEach(async () => {
  const module: TestingModule = await Test.createTestingModule({
    providers: [
      UsersService,
      {
        provide: getRepositoryToken(User),
        useValue: mockRepository,
      },
    ],
  }).compile();

  service = module.get<UsersService>(UsersService);
});

afterEach(() => {
  jest.clearAllMocks();
});

  describe('create', () => {
    it('deve criar um usuário', async () => {
      const dto = {
      login: 'Carlos1',
      name: 'Carlos',
      password: 'Senhasupersecreta1!',
      email: 'carlos@gmail.com',
      tipodeconta: UserRole.OUVINTE,
    };

    const userMock = {
      ...dto,
      playbacks: [],
    };

    mockRepository.create.mockReturnValue(userMock);
    mockRepository.save.mockResolvedValue(userMock);

    const resultado = await service.create(dto);

    expect(mockRepository.create).toHaveBeenCalledWith(dto);
    expect(mockRepository.save).toHaveBeenCalledWith(userMock);
    expect(resultado).toEqual(userMock);
    });
  })

  describe('findAll', () => {

  it('deve retornar todos os usuários', async () => {
    const usersMock = [
      {
        login: 'Carlos1',
        name: 'Carlos',
        password: 'Senhasupersecreta1!',
        email: 'carlos@gmail.com',
        tipodeconta: UserRole.OUVINTE,
      },
      {
        login: 'Ana1',
        name: 'Ana',
        password: 'Senhasupersecreta2!',
        email: 'ana@gmail.com',
        tipodeconta: UserRole.OUVINTE,
      },
    ];

    mockRepository.find.mockResolvedValue(usersMock);

    const resultado = await service.findAll();

    expect(mockRepository.find).toHaveBeenCalled();
    expect(resultado).toEqual(usersMock);
  });

  it('deve retornar lista vazia quando não houver usuários', async () => {
    mockRepository.find.mockResolvedValue([]);

    const resultado = await service.findAll();

    expect(mockRepository.find).toHaveBeenCalled();
    expect(resultado).toEqual([]);
    expect(resultado).toHaveLength(0);
  });
  });

  describe('findOne', () => {
    it('deve retornar um usuário quando existir', async () => {
    const userMock = {
      login: 'Carlos1',
      name: 'Carlos',
      password: 'Senhasupersecreta1!',
      email: 'carlos@gmail.com',
      tipodeconta: UserRole.OUVINTE,
    };
    mockRepository.findOneBy.mockResolvedValue(userMock);
    const resultado = await service.findOne('Carlos1');
    expect(mockRepository.findOneBy).toHaveBeenCalledWith({
      login: 'Carlos1',
    });

    expect(resultado).toEqual(userMock);
  });

  it('deve lançar NotFoundException quando não existir', async () => {
  mockRepository.findOneBy.mockResolvedValue(null);
  await expect(service.findOne('usuarioInexistente'),).rejects.toThrow(NotFoundException);
  expect(mockRepository.findOneBy).toHaveBeenCalledWith({
    login: 'usuarioInexistente',
  });
  });
  });

  describe('findByLogin', () => {

    it('deve retornar um usuário quando existir', async () => {
    const userMock = {
      login: 'Carlos1',
      name: 'Carlos',
      password: 'Senhasupersecreta1!',
      email: 'carlos@gmail.com',
      tipodeconta: UserRole.OUVINTE,
    };

    mockRepository.findOneBy.mockResolvedValue(userMock);

    const resultado = await service.findByLogin('Carlos1');

    expect(mockRepository.findOneBy).toHaveBeenCalledWith({
      login: 'Carlos1',
    });

    expect(resultado).toEqual(userMock);
  });

  it('deve retornar null quando o usuário não existir', async () => {
    mockRepository.findOneBy.mockResolvedValue(null);
    const resultado = await service.findByLogin('usuarioInexistente');
    expect(mockRepository.findOneBy).toHaveBeenCalledWith({
      login: 'usuarioInexistente',
    });
    expect(resultado).toBeNull();
  });
  });

  describe('findByEmail', () => {

    it('deve retornar um usuário quando o e-mail existir', async () => {
      const userMock = {
        login: 'Carlos1',
        name: 'Carlos',
        password: 'Senhasupersecreta1!',
        email: 'carlos@gmail.com',
        tipodeconta: UserRole.OUVINTE,
      };

      mockRepository.findOneBy.mockResolvedValue(userMock);

      const resultado = await service.findByEmail('carlos@gmail.com');

      expect(mockRepository.findOneBy).toHaveBeenCalledWith({
        email: 'carlos@gmail.com',
      });

      expect(resultado).toEqual(userMock);
    });

    it('deve retornar null quando o e-mail não existir', async () => {
      mockRepository.findOneBy.mockResolvedValue(null);

      const resultado = await service.findByEmail('inexistente@gmail.com');

      expect(mockRepository.findOneBy).toHaveBeenCalledWith({
        email: 'inexistente@gmail.com',
      });

      expect(resultado).toBeNull();
    });
  });

  describe('update', () => {
  it('deve atualizar um usuário', async () => {
    const userMock = {
      login: 'Carlos1',
      name: 'Carlos',
      password: 'Senhasupersecreta1!',
      email: 'carlos@gmail.com',
      tipodeconta: UserRole.OUVINTE,
    };
    const updateDto = {name: 'Carlos Roberto',};
    jest.spyOn(service, 'findOne').mockResolvedValue(userMock as any);
    mockRepository.save.mockResolvedValue({
      ...userMock,
      ...updateDto,
    });
    const resultado = await service.update('Carlos1', updateDto);
    expect(service.findOne).toHaveBeenCalledWith('Carlos1');
    expect(mockRepository.save).toHaveBeenCalledWith({
      ...userMock,
      ...updateDto,
    });
    expect(resultado).toEqual({
  message: 'Dados atualizados com sucesso.',
  user: {
    ...userMock,
    ...updateDto,
  },
});
  });
    it('deve lançar NotFoundException quando o usuário não existir', async () => {
    jest.spyOn(service, 'findOne').mockRejectedValue(
      new NotFoundException('User not found'),
    );
    await expect(service.update('inexistente', { name: 'Novo Nome' }),).rejects.toThrow(NotFoundException);
    expect(mockRepository.save).not.toHaveBeenCalled();
  });
});

  describe('remove', () => {
  it('deve remover um usuário', async () => {
    const userMock = {
      login: 'Carlos1',
      name: 'Carlos',
      password: 'Senhasupersecreta1!',
      email: 'carlos@gmail.com',
      tipodeconta: UserRole.OUVINTE,
    };
    const removeUserDto: RemoveUserDto = {
      password: 'Senhasupersecreta1!',
    };
    jest.spyOn(service, 'findOne').mockResolvedValue(userMock as any);
    mockRepository.remove.mockResolvedValue(userMock);
    const resultado = await service.remove('Carlos1', removeUserDto);
    expect(service.findOne).toHaveBeenCalledWith('Carlos1');
    expect(mockRepository.remove).toHaveBeenCalledWith(userMock);
    expect(resultado).toEqual({
  message: 'A conta foi removida do sistema com sucesso.',
  user: userMock,
});
  });
    it('deve lançar NotFoundException quando o usuário não existir', async () => {
    const removeUserDto: RemoveUserDto = {
      password: 'Senhasupersecreta1!',
    };
      jest.spyOn(service, 'findOne').mockRejectedValue(
      new NotFoundException('User not found'),
    );
    await expect(service.remove('inexistente', removeUserDto),).rejects.toThrow(NotFoundException);
    expect(mockRepository.remove).not.toHaveBeenCalled();
  });
  it('deve lançar UnauthorizedException quando a senha estiver incorreta', async () => {
    const userMock = {
      login: 'Carlos1',
      name: 'Carlos',
      password: 'Senhasupersecreta1!',
      email: 'carlos@gmail.com',
      tipodeconta: UserRole.OUVINTE,
    };

    const removeUserDto: RemoveUserDto = {
      password: 'senhaErrada',
    };
    jest.spyOn(service, 'findOne').mockResolvedValue(userMock as any);
    await expect(
      service.remove('Carlos1', removeUserDto),
    ).rejects.toThrow(UnauthorizedException);

    expect(mockRepository.remove).not.toHaveBeenCalled();
  });
  });
});
