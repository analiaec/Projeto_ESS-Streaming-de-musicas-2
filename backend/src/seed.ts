import { DataSource } from 'typeorm';
import { Musica }     from './musicas/musica.entity';
import { User, UserRole } from './users/entities/user.entity';
import { Artista }    from './artistas/artista.entity';
import { Album }      from './albuns/album.entity';
import { Podcast }    from './podcast/entities/podcast.entity';
import { Episode }    from './episodes/entities/episode.entity';

import * as dotenv from 'dotenv';
dotenv.config();

const AppDataSource = new DataSource({
  type: 'postgres',
  host:     process.env.DB_HOST ?? 'localhost',
  port:     parseInt(process.env.DB_PORT ?? '5432'),
  username: process.env.DB_USER ?? 'postgres',
  password: process.env.DB_PASS ?? 'postgres',
  database: process.env.DB_NAME ?? 'streaming',
  entities: [Musica, User, Album, Artista, Podcast, Episode],
  synchronize: true,
});

async function seed() {
  await AppDataSource.initialize();
  console.log('Conectado ao banco de dados...');

  // limpa tudo em ordem segura
  await AppDataSource.query(`
  TRUNCATE TABLE 
    episodes,
    podcast,
    "musica_artistas",
    musicas,
    scores,
    "Playback",
    albuns,
    artistas,
    users
  RESTART IDENTITY CASCADE
`);
console.log('Tabelas limpas...');

  // ── Usuários ──────────────────────────────────────────────────────────────
  const usuarioRepo = AppDataSource.getRepository(User);
  await usuarioRepo.save([
    { login: 'LuisCardoso012', name: 'Luis Cardoso',   password: '1234',     email: 'luis@streaming.com',    tipodeconta: UserRole.OUVINTE },
    { login: 'Usuario',        name: 'Usuario Teste',  password: '1234',     email: 'usuario@streaming.com', tipodeconta: UserRole.OUVINTE },
    { login: 'admin',          name: 'Administrador',  password: 'admin123', email: 'admin@wave.com',        tipodeconta: UserRole.ADMIN   },
  ]);
  console.log('3 usuários criados...');

  // ── Artistas ──────────────────────────────────────────────────────────────
  const artistaRepo = AppDataSource.getRepository(Artista);
  const [noelRosa, djavan, joaoGilberto, tomJobim, templeOfTheDog, aliceInChains, danielaMercury, pjHarvey] =
    await artistaRepo.save([
      { login: 'noel.rosa',       name: 'Noel Rosa',          password: '1234', email: 'noel@streaming.com',        tipodeconta: UserRole.ARTISTA, nomeArtistico: 'Noel Rosa'          },
      { login: 'djavan',          name: 'Djavan',             password: '1234', email: 'djavan@streaming.com',      tipodeconta: UserRole.ARTISTA, nomeArtistico: 'Djavan'             },
      { login: 'joao.gilberto',   name: 'João Gilberto',      password: '1234', email: 'joao@streaming.com',        tipodeconta: UserRole.ARTISTA, nomeArtistico: 'João Gilberto'      },
      { login: 'tom.jobim',       name: 'Tom Jobim',          password: '1234', email: 'tom@streaming.com',         tipodeconta: UserRole.ARTISTA, nomeArtistico: 'Tom Jobim'          },
      { login: 'temple.ofthedog', name: 'Temple of the Dog',  password: '1234', email: 'chris@streaming.com',       tipodeconta: UserRole.ARTISTA, nomeArtistico: 'Temple of the Dog'  },
      { login: 'alice.InChains',  name: 'Alice in Chains',    password: '1234', email: 'layne@streaming.com',       tipodeconta: UserRole.ARTISTA, nomeArtistico: 'Alice in Chains'    },
      { login: 'daniela.mercury', name: 'Daniela Mercury',    password: '1234', email: 'danimercury@streaming.com', tipodeconta: UserRole.ARTISTA, nomeArtistico: 'Daniela Mercury'    },
      { login: 'pj.harvey',       name: 'PJ Harvey',          password: '1234', email: 'pj@streaming.com',          tipodeconta: UserRole.ARTISTA, nomeArtistico: 'PJ Harvey'          },
    ]);
  console.log('8 artistas criados...');

  // ── Álbuns ────────────────────────────────────────────────────────────────
  const albumRepo = AppDataSource.getRepository(Album);
  const [isThisDesire, getzGilberto, chegaDeSaudade, djavan1992, djavan1989, luz, milagreiro, noelClassicos, templeOfDog, facelift, musicaderua] =
    await albumRepo.save([
      { nome: 'Is This Desire?',         data: '1998-01-01', generos: ['AltRock'],    capaUrl: '/uploads/capas/is_this_desire.jpg'    },
      { nome: 'Getz/Gilberto',           data: '1964-01-01', generos: ['Bossa Nova'], capaUrl: '/uploads/capas/getz_gilberto.jpg'     },
      { nome: 'Chega de Saudade',        data: '1959-01-01', generos: ['Bossa Nova'], capaUrl: '/uploads/capas/chega_de_saudade.jpg'  },
      { nome: 'Coisa de acender',        data: '1992-01-01', generos: ['MPB'],        capaUrl: '/uploads/capas/djavan1992.jpg'        },
      { nome: 'Djavan(1989)',            data: '1989-01-01', generos: ['MPB'],        capaUrl: '/uploads/capas/djavan1989.jpg'        },
      { nome: 'Luz',                     data: '1982-01-01', generos: ['MPB'],        capaUrl: '/uploads/capas/luz.jpg'               },
      { nome: 'Milagreiro',              data: '2001-01-01', generos: ['MPB'],        capaUrl: '/uploads/capas/milagreiro.jpg'        },
      { nome: 'Noel Classicos',          data: '1931-01-01', generos: ['Samba'],      capaUrl: '/uploads/capas/noel_rosa.jpg'         },
      { nome: 'Temple of the Dog(1991)', data: '1991-01-01', generos: ['Rock'],       capaUrl: '/uploads/capas/TempleOfTheDog.jpg'    },
      { nome: 'Facelift',                data: '1990-01-01', generos: ['Rock'],       capaUrl: '/uploads/capas/facelift.jpg'          },
      { nome: 'Música de rua',           data: '1994-01-01', generos: ['Axé'],        capaUrl: '/uploads/capas/musica_de_rua.jpg'     },
    ]);
  console.log('11 álbuns criados...');

  // ── Músicas ───────────────────────────────────────────────────────────────
  // arquivoUrl: substituir pelas URLs reais dos arquivos de áudio
  const musicaRepo = AppDataSource.getRepository(Musica);
  await musicaRepo.save([
    { titulo: 'Catherine',              reproducoes: 500,  album: isThisDesire,   artistas: [pjHarvey],        arquivoUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3' },
    { titulo: 'Chega de Saudade',       reproducoes: 800,  album: chegaDeSaudade, artistas: [joaoGilberto],    arquivoUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3' },
    { titulo: 'Desafinado',             reproducoes: 750,  album: chegaDeSaudade, artistas: [joaoGilberto],    arquivoUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3' },
    { titulo: 'Garota de Ipanema',      reproducoes: 950,  album: getzGilberto,   artistas: [tomJobim],        arquivoUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3' },
    { titulo: 'Se..',                   reproducoes: 980,  album: djavan1992,     artistas: [djavan],          arquivoUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3' },
    { titulo: 'Oceano',                 reproducoes: 1000, album: djavan1989,     artistas: [djavan],          arquivoUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3' },
    { titulo: 'Sina',                   reproducoes: 999,  album: luz,            artistas: [djavan],          arquivoUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-7.mp3' },
    { titulo: 'Eu te devoro',           reproducoes: 980,  album: milagreiro,     artistas: [djavan],          arquivoUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3' },
    { titulo: 'Conversa de Botequim',   reproducoes: 300,  album: noelClassicos,  artistas: [noelRosa],        arquivoUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-9.mp3' },
    { titulo: 'Com Que Roupa',          reproducoes: 400,  album: noelClassicos,  artistas: [noelRosa],        arquivoUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-10.mp3' },
    { titulo: 'Hunger Strike',          reproducoes: 200,  album: templeOfDog,    artistas: [templeOfTheDog],  arquivoUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-11.mp3' },
    { titulo: 'Say Hello to Heaven',    reproducoes: 400,  album: templeOfDog,    artistas: [templeOfTheDog],  arquivoUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-12.mp3' },
    { titulo: 'Love, Hate, Love',       reproducoes: 200,  album: facelift,       artistas: [aliceInChains],   arquivoUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-13.mp3' },
    { titulo: 'Bleed the Freak',        reproducoes: 550,  album: facelift,       artistas: [aliceInChains],   arquivoUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-14.mp3' },
    { titulo: 'Man in the Box',         reproducoes: 650,  album: facelift,       artistas: [aliceInChains],   arquivoUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-15.mp3' },
    { titulo: 'Swing da Cor',           reproducoes: 450,  album: musicaderua,    artistas: [danielaMercury],  arquivoUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-16.mp3' },
  ]);
  console.log('16 músicas criadas...');

  // ── Podcasters ────────────────────────────────────────────────────────────
  // IMPORTANTE: salva em users E em podcast para que o login funcione
  const userRepo    = AppDataSource.getRepository(User);
  const podcastRepo = AppDataSource.getRepository(Podcast);
  const episodeRepo = AppDataSource.getRepository(Episode);

  const podcasterData = [
    {
      login:    'techcast',
      name:     'TechCast Brasil',
      password: '1234',
      email:    'techcast@streaming.com',
      descricao: 'Tecnologia, programação e inovação em português. Episódios semanais sobre o mundo tech.',
    },
    {
      login:    'historiasbr',
      name:     'Histórias do Brasil',
      password: '1234',
      email:    'historias@streaming.com',
      descricao: 'Contos, lendas e fatos curiosos da história brasileira narrados de forma descontraída.',
    },
    {
      login:    'podteste1',
      name:     'Podcaster Teste',
      password: '123456',
      email:    'podcaster@streaming.com',
      descricao: 'Canal de testes para demonstração da plataforma.',
    },
  ];

  for (const dados of podcasterData) {
    // salva em users para login funcionar
    await userRepo.save({ ...dados, tipodeconta: UserRole.PODCASTER });
    // salva em podcast para aparecer na listagem
    const podcast = await podcastRepo.save({ ...dados, tipodeconta: UserRole.PODCASTER });

    console.log(`Podcaster ${podcast.login} criado...`);

    // episódios — substituir arquivoUrl pelas URLs reais dos seus áudios
    const episodios =
      podcast.login === 'techcast'
        ? [
            { titulo: 'Ep. 1 — Saas e Cloud potencializam o Agile',           arquivoUrl: 'https://res.cloudinary.com/drzffqhto/video/upload/v1780953611/SaaS_e_Cloud_potenciam_o_Agile_yapp0y.mp4',                        publicado: true,  publicadoEm: new Date('2026-01-10') },
            { titulo: 'Ep. 2 — Como o Rails estrutura aplicativos web',       arquivoUrl: 'https://res.cloudinary.com/drzffqhto/video/upload/v1780954419/Como_o_Rails_estrutura_aplicativos_web_ea4nbm.mp4',                publicado: true,  publicadoEm: new Date('2026-01-17') },
            { titulo: 'Ep. 3 — De Monólitos a Microsserviços com APIs REST',  arquivoUrl: 'https://res.cloudinary.com/drzffqhto/video/upload/v1780954429/De_Mon%C3%B3litos_a_Microsservi%C3%A7os_com_APIs_REST_emwixm.mp4', publicado: true,  publicadoEm: new Date('2026-01-24') },
            { titulo: 'Ep. 4 — Ecossistema Ruby e programação em par',        arquivoUrl: 'https://res.cloudinary.com/drzffqhto/video/upload/v1780955238/Ecossistema_Ruby_e_programa%C3%A7%C3%A3o_em_par_zrlcsh.mp4',       publicado: false, dataPublicacaoAgendada: new Date('2026-12-31') },
          ]
        : podcast.login === 'historiasbr'
        ? [
            { titulo: 'Ep. 1 — O Descobrimento do Brasil não foi acaso',              arquivoUrl: 'https://res.cloudinary.com/drzffqhto/video/upload/v1780955408/O_descobrimento_do_Brasil_n%C3%A3o_foi_acaso_m978rw.mp4',                    publicado: true,  publicadoEm: new Date('2026-02-05') },
            { titulo: 'Ep. 2 — Guerra econômica nas invasões francesas e holandesas', arquivoUrl: 'https://res.cloudinary.com/drzffqhto/video/upload/v1781012262/Guerra_econ%C3%B4mica_nas_invas%C3%B5es_francesas_e_holandesas_ntrlrk.mp4',  publicado: true,  publicadoEm: new Date('2026-02-12') },
            { titulo: 'Ep. 3 — A Unificação Armada do Brasil Colonial',               arquivoUrl: 'https://res.cloudinary.com/drzffqhto/video/upload/v1781012285/A_unifica%C3%A7%C3%A3o_armada_do_Brasil_colonial_tsizzi.mp4',                publicado: true,  publicadoEm: new Date('2026-02-19') },
          ]
        : [
            { titulo: 'Ep. 1 — Episódio de teste',  arquivoUrl: null, publicado: true,  publicadoEm: new Date('2026-03-01') },
          ];

    for (const ep of episodios) {
      await episodeRepo.save({ ...ep, reproducoes: 0, podcast });
    }
    console.log(`  ${episodios.length} episódios criados para ${podcast.login}`);
  }

  console.log('\nBanco populado com sucesso!');
  await AppDataSource.destroy();
}

seed().catch((erro) => {
  console.error('Erro ao popular o banco:', erro);
  process.exit(1);
});
