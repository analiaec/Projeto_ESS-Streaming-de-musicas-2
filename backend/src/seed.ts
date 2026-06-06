import { DataSource } from 'typeorm';
import { Musica } from './musicas/musica.entity';
import { User, UserRole} from './users/entities/user.entity';
import {Artista} from './artistas/artista.entity';
import { Album } from './albuns/album.entity';

import * as dotenv from 'dotenv';

dotenv.config();
const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST ?? 'localhost',
  port: parseInt(process.env.DB_PORT ?? '5432'),
  username: process.env.DB_USER ?? 'postgres',
  password: process.env.DB_PASS ?? 'postgres',
  database: process.env.DB_NAME ?? 'streaming',
  entities: [Musica, User, Album, Artista],
  synchronize: true,
});

async function seed() {
  await AppDataSource.initialize();
  console.log('Conectado ao banco de dados...');

  const musicaRepository  = AppDataSource.getRepository(Musica);
  const usuarioRepository = AppDataSource.getRepository(User);
  const artistaRepository = AppDataSource.getRepository(Artista);
  const albumRepository = AppDataSource.getRepository(Album);



  await AppDataSource.query('DELETE FROM musica_artistas WHERE 1=1').catch(() => {});
    await AppDataSource.query('DELETE FROM musicas WHERE 1=1').catch(() => {});
    await AppDataSource.query('TRUNCATE musica_artistas, musicas, albuns, artistas, users RESTART IDENTITY CASCADE');
    await AppDataSource.query('DELETE FROM artistas WHERE 1=1').catch(() => {});
    await AppDataSource.query('DELETE FROM users WHERE 1=1').catch(() => {});
    console.log('Tabelas limpas...');

 
  const usuarios = await usuarioRepository.save([
  {
    login: 'LuisCardoso012',
    name: 'Luis Cardoso',
    password: '1234',
    email: 'luis@streaming.com',
    role: UserRole.OUVINTE,
  },
  {
    login: 'Usuario',
    name: 'Usuario Teste',
    password: '1234',
    email: 'usuario@streaming.com',
    role: UserRole.OUVINTE,
  },
  ]);
  console.log(`${usuarios.length} usuários criados...`);

  const noelRosa = await artistaRepository.save({
    login:         'noel.rosa',
    name:          'Noel Rosa',
    password:      '1234',
    email:         'noel@streaming.com',
    role:          UserRole.ARTISTA,
    nomeArtistico: 'Noel Rosa',
    });

    const djavan = await artistaRepository.save({
    login:         'djavan',
    name:          'Djavan',
    password:      '1234',
    email:         'djavan@streaming.com',
    role:          UserRole.ARTISTA,
    nomeArtistico: 'Djavan',
    });

    const joaoGilberto = await artistaRepository.save({
    login:         'joao.gilberto',
    name:          'João Gilberto',
    password:      '1234',
    email:         'joao@streaming.com',
    role:          UserRole.ARTISTA,
    nomeArtistico: 'João Gilberto',
    });

    const tomJobim = await artistaRepository.save({
    login:         'tom.jobim',
    name:          'Tom Jobim',
    password:      '1234',
    email:         'tom@streaming.com',
    role:          UserRole.ARTISTA,
    nomeArtistico: 'Tom Jobim',
    });
    const chrisCornell = await artistaRepository.save({
    login:         'chris.cornell',
    name:          'Chris Cornell',
    password:      '1234',
    email:         'chris@streaming.com',
    role:          UserRole.ARTISTA,
    nomeArtistico: 'Chris Cornell',
    });

    const layneStaley = await artistaRepository.save({
    login:         'layne.staley',
    name:          'Layne Staley',
    password:      '1234',
    email:         'layne@streaming.com',
    role:          UserRole.ARTISTA,
    nomeArtistico: 'Layne Staley',
    });

    const pjHarvey = await artistaRepository.save({
    login:         'pj.harvey',
    name:          'PJ Harvey',
    password:      '1234',
    email:         'pj@streaming.com',
    role:          UserRole.ARTISTA,
    nomeArtistico: 'PJ Harvey',
    });


  console.log('4 artistas criados...');

  const albums = await albumRepository.save([
  { nome: 'Album Pop',       data: '2020-01-01', generos: ['Pop']       },
  { nome: 'Album Bossa Nova', data: '1958-01-01', generos: ['Bossa Nova'] },
  { nome: 'Album MPB',       data: '1989-01-01', generos: ['MPB']       },
  { nome: 'Album Samba',     data: '1931-01-01', generos: ['Samba']     },
  { nome: 'Album Axe',       data: '1994-01-01', generos: ['Axé']       },
  ]);
  const [albumPop, albumBossaNova, albumMPB, albumSamba, albumAxe] = albums;
  console.log(`${albums.length} álbuns criados...`);
 
  const musicas = await musicaRepository.save([
  { titulo: 'MusicaBonita123',   genero: 'Pop',        ano: 2020, reproducoes: 500,  album: albumPop, artistas: [layneStaley] },
  { titulo: 'Chega de Saudade',  genero: 'Bossa Nova', ano: 1958, reproducoes: 800,  album: albumBossaNova , artistas: [joaoGilberto] },
  { titulo: 'Desafinado',        genero: 'Bossa Nova', ano: 1959, reproducoes: 750,  album: albumBossaNova , artistas: [joaoGilberto] },
  { titulo: 'Garota de Ipanema', genero: 'Bossa Nova', ano: 1962, reproducoes: 950,  album: albumBossaNova , artistas: [tomJobim] },
  { titulo: 'Se..',              genero: 'MPB',        ano: 1990, reproducoes: 980,  album: albumMPB       , artistas: [djavan] },
  { titulo: 'Oceano',            genero: 'MPB',        ano: 1989, reproducoes: 1000, album: albumMPB       , artistas: [djavan] },
  { titulo: 'Sina',              genero: 'MPB',        ano: 1990, reproducoes: 999,  album: albumMPB       , artistas: [djavan]},
  { titulo: 'Eu te devoro',      genero: 'MPB',        ano: 1985, reproducoes: 980, album: albumMPB       , artistas: [djavan]},
  { titulo: 'Noel Clássico',     genero: 'Samba',      ano: 1935, reproducoes: 300,  album: albumSamba     , artistas: [noelRosa]},
  { titulo: 'Com Que Roupa',     genero: 'Samba',      ano: 1931, reproducoes: 400,  album: albumSamba     , artistas: [noelRosa]},
  { titulo: 'Mamãe Eu Quero',    genero: 'Samba',      ano: 1994, reproducoes: 200,  album: albumSamba     , artistas: [chrisCornell]},
  { titulo: 'Swing da Cor',      genero: 'Axé',        ano: 1994, reproducoes: 450,  album: albumAxe       , artistas:[pjHarvey]},
]);

  console.log(`${musicas.length} músicas criadas...`);
  console.log('Banco populado com sucesso!');

  await AppDataSource.destroy();
}

seed().catch((erro) => {
  console.error('Erro ao popular o banco:', erro);
  process.exit(1);
});