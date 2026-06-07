import { DataSource } from 'typeorm';
import { Musica } from './musicas/musica.entity';
import { User, UserRole } from './users/entities/user.entity';
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
      login:       'LuisCardoso012',
      name:        'Luis Cardoso',
      password:    '1234',
      email:       'luis@streaming.com',
      tipodeconta: UserRole.OUVINTE,
    },
    {
      login:       'Usuario',
      name:        'Usuario Teste',
      password:    '1234',
      email:       'usuario@streaming.com',
      tipodeconta: UserRole.OUVINTE,
    },
  ]);
  console.log(`${usuarios.length} usuários criados...`);

  const noelRosa = await artistaRepository.save({
    login:         'noel.rosa',
    name:          'Noel Rosa',
    password:      '1234',
    email:         'noel@streaming.com',
    tipodeconta:   UserRole.ARTISTA,
    nomeArtistico: 'Noel Rosa',
    });

    const djavan = await artistaRepository.save({
    login:         'djavan',
    name:          'Djavan',
    password:      '1234',
    email:         'djavan@streaming.com',
    tipodeconta:   UserRole.ARTISTA,
    nomeArtistico: 'Djavan',
    });

    const joaoGilberto = await artistaRepository.save({
    login:         'joao.gilberto',
    name:          'João Gilberto',
    password:      '1234',
    email:         'joao@streaming.com',
    tipodeconta:   UserRole.ARTISTA,
    nomeArtistico: 'João Gilberto',
    });

    const tomJobim = await artistaRepository.save({
    login:         'tom.jobim',
    name:          'Tom Jobim',
    password:      '1234',
    email:         'tom@streaming.com',
    tipodeconta:   UserRole.ARTISTA,
    nomeArtistico: 'Tom Jobim',
    });
    const templeOfTheDog = await artistaRepository.save({
    login:         'temple.ofthedog',
    name:          'Temple of the Dog',
    password:      '1234',
    email:         'chris@streaming.com',
    tipodeconta:   UserRole.ARTISTA,
    nomeArtistico: 'Temple of the Dog',
    });

    const aliceInChains = await artistaRepository.save({
    login:         'alice.InChains',
    name:          'Alice in Chains',
    password:      '1234',
    email:         'layne@streaming.com',
    tipodeconta:   UserRole.ARTISTA,
    nomeArtistico: 'Alice in Chains',
    });

    const danielaMercury = await artistaRepository.save({
    login:         'daniela.mercury',
    name:          'Daniela Mercury',
    password:      '1234',
    email:         'danimercury@streaming.com',
    tipodeconta:   UserRole.ARTISTA,
    nomeArtistico: 'Daniela Mercury',
    });

    const pjHarvey = await artistaRepository.save({
    login:         'pj.harvey',
    name:          'PJ Harvey',
    password:      '1234',
    email:         'pj@streaming.com',
    tipodeconta:   UserRole.ARTISTA,
    nomeArtistico: 'PJ Harvey',
    });


  console.log('4 artistas criados...');

  const albums = await albumRepository.save([
  { nome: 'Is This Desire?',       data: '1998-01-01', generos: ['AltRock'], capaUrl:  '/uploads/capas/is_this_desire.jpg'    },
  { nome: 'Getz/Gilberto', data: '1964-01-01', generos: ['Bossa Nova'], capaUrl: '/uploads/capas/getz_gilberto.jpg'},
  { nome: 'Chega de Saudade', data: '1959-01-01', generos: ['Bossa Nova'], capaUrl: '/uploads/capas/chega_de_saudade.jpg'},
  { nome: 'Coisa de acender',       data: '1992-01-01', generos: ['MPB'], capaUrl:  '/uploads/capas/djavan1992.jpg'     },
  { nome: 'Djavan(1989)',       data: '1989-01-01', generos: ['MPB'], capaUrl: '/uploads/capas/djavan1989.jpg'      },
  { nome: 'Luz',       data: '1982-01-01', generos: ['MPB'] , capaUrl: '/uploads/capas/luz.jpg'     },
  { nome: 'Milagreiro',       data: '2001-01-01', generos: ['MPB'], capaUrl: '/uploads/capas/milagreiro.jpg'     },
  { nome: 'Noel Classicos',     data: '1931-01-01', generos: ['Samba'], capaUrl: '/uploads/capas/noel_rosa.jpg'    },
  { nome: 'Temple of the Dog(1991)',     data: '1991-01-01', generos: ['Rock'], capaUrl: '/uploads/capas/TempleOfTheDog.jpg'    },
  { nome: 'Facelift',     data: '1990-01-01', generos: ['Rock'], capaUrl: '/uploads/capas/facelift.jpg'    },
  { nome: 'Música de rua',       data: '1994-01-01', generos: ['Axé'], capaUrl: '/uploads/capas/musica_de_rua.jpg'      },
  ]);
  const [isThisDesire, getzGilberto, chegaDeSaudade, djavan1992, djavan1989, luz, milagreiro, noelClassicos, templeOfDog, facelift, musicaderua] = albums;
  console.log(`${albums.length} álbuns criados...`);
 
  const musicas = await musicaRepository.save([
  { titulo: 'Catherine',   genero: 'AltRock',        ano: 1998, reproducoes: 500,  album: isThisDesire, artistas: [pjHarvey] },
  { titulo: 'Chega de Saudade',  genero: 'Bossa Nova', ano: 1958, reproducoes: 800,  album: chegaDeSaudade , artistas: [joaoGilberto] },
  { titulo: 'Desafinado',        genero: 'Bossa Nova', ano: 1959, reproducoes: 750,  album: chegaDeSaudade , artistas: [joaoGilberto] },
  { titulo: 'Garota de Ipanema', genero: 'Bossa Nova', ano: 1962, reproducoes: 950,  album: getzGilberto , artistas: [tomJobim] },
  { titulo: 'Se..',              genero: 'MPB',        ano: 1990, reproducoes: 980,  album: djavan1992       , artistas: [djavan] },
  { titulo: 'Oceano',            genero: 'MPB',        ano: 1989, reproducoes: 1000, album: djavan1989       , artistas: [djavan] },
  { titulo: 'Sina',              genero: 'MPB',        ano: 1990, reproducoes: 999,  album: luz       , artistas: [djavan]},
  { titulo: 'Eu te devoro',      genero: 'MPB',        ano: 1985, reproducoes: 980, album: milagreiro      , artistas: [djavan]},
  { titulo: 'Conversa de Botequim',     genero: 'Samba',      ano: 1935, reproducoes: 300,  album: noelClassicos    , artistas: [noelRosa]},
  { titulo: 'Com Que Roupa',     genero: 'Samba',      ano: 1931, reproducoes: 400,  album: noelClassicos    , artistas: [noelRosa]},
  { titulo: 'Hunger Strike',    genero: 'Rock',      ano: 1994, reproducoes: 200,  album: templeOfDog    , artistas: [templeOfTheDog]},
  { titulo: 'Say Hello to Heaven',    genero: 'Rock',      ano: 1994, reproducoes: 400,  album: templeOfDog    , artistas: [templeOfTheDog]},
  { titulo: 'Love, Hate, Love',    genero: 'Rock',      ano: 1990, reproducoes: 200,  album: facelift   , artistas: [aliceInChains]},
  { titulo: 'Bleed the Freak',    genero: 'Rock',      ano: 1990, reproducoes: 550,  album: facelift   , artistas: [aliceInChains]},
  { titulo: 'Man in the Box',    genero: 'Rock',      ano: 1990, reproducoes: 650,  album: facelift   , artistas: [aliceInChains]},
  { titulo: 'Swing da Cor',      genero: 'Axé',        ano: 1994, reproducoes: 450,  album: musicaderua      , artistas:[danielaMercury]},
]);

  console.log(`${musicas.length} músicas criadas...`);
  console.log('Banco populado com sucesso!');

  await AppDataSource.destroy();
}

seed().catch((erro) => {
  console.error('Erro ao popular o banco:', erro);
  process.exit(1);
});