const {Given, When, Then, BeforeAll, AfterAll, Before} = require('@cucumber/cucumber')
const {AppModule} = require('../../src/app.module');
const { Test } = require('@nestjs/testing');
const { User } = require('../../src/users/entities/user.entity');
const { DataSource } = require('typeorm'); 
const {ValidationPipe} = require('@nestjs/common')
const request = require('supertest');
let requestbody = {};
let response;
let app;
let userRepository;
let dataSource;

        BeforeAll(async function () {
            const moduleRef = await Test.createTestingModule({imports: [AppModule],}).compile();
            app = moduleRef.createNestApplication();
            app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
            app.setGlobalPrefix('api')
            await app.init();
            dataSource = moduleRef.get(DataSource);
            userRepository = dataSource.getRepository(User);
        });
        
        AfterAll(async function () {
            await app.close();
        });

        Before(async function () {
            if (dataSource && dataSource.isInitialized) { //reseta as tabelas antes de cada cenario
            try {
                //tenta limpar usando o nome padrão da tabela do TypeORM
                await dataSource.query('TRUNCATE TABLE "user" CASCADE;'); 
            } catch (error) {
                //se falhar (ex: se a tabela se chamar "users"), tenta no plural
                await dataSource.query('TRUNCATE TABLE "users" CASCADE;'); 
        }}});

        Given('existe uma conta já cadastrada com o Login {string}', async function (login) {
            await userRepository.save({login,
            name: 'Carlos',
            password: 'Senha123!',
            email: 'carlos@gmail.com',
            tipodeconta: 'OUVINTE',
        });
        });

         Given('eu estou na página de {string}', function (string) {
            // Implementar mais tarde no frontend
            requestbody = {}; //apenas para inicializar contexto
            //return 'pending';
         });
          
         When('eu preencho os campos com:', function (dataTable) {
            // Pega a primeira linha do datatable e transforma em objeto
            requestbody = dataTable.hashes()[0];
        });
  
        When('eu seleciono {string}', async function (acao) {
            if (acao === 'Finalizar cadastro') {
            response = await request(app.getHttpServer()) //manda o request pro server de acordo com o .post e o .send
            .post('/api/auth/register')
            .send(requestbody);
        }});
       
         Then('o usuário de login {string} existe com os campos:', async function (login, dataTable) {
            const esperado = dataTable.hashes()[0];
            //busca usuário no banco
            const usuario = await userRepository.findOne({where: { login },});
            if (!usuario) {throw new Error('Usuário não encontrado');}
            //valida cada campo da tabela dinamicamente
            for (const campo in esperado) {
            if (usuario[campo] != esperado[campo]) {throw new Error(`Campo ${campo} incorreto`,);}
            }
        });
       
         Then('eu vou para a {string}', function (pagina) {
            if (pagina === 'Página inicial') {
            if (response.status !== 201) {throw new Error('Não foi para a página inicial',);}
        }});
       
         Then('eu vejo uma mensagem na tela de {string}', function (mensagemEsperada) {
            //process.stdout.write(`\n\nCORPO DA RESPOSTA DA API: ${JSON.stringify(response.body, null, 2)}\n\n`); //mensagem pra analisar o corpo da resposta
            //process.stdout.write(`\n\nMSG ESPERADA (CUCUMBER): "${mensagemEsperada}"\n\n`); //mensagem para ver a variavel mensagemEsperada
            let mensagemRecebida = Array.isArray(response.body.message) ? response.body.message : [response.body.message];
            if (!mensagemRecebida.includes(mensagemEsperada)) {throw new Error( `Mensagem não encontrada.\nEsperada: "${mensagemEsperada}"\nRecebidas: ${JSON.stringify(mensagens)}`);}
        });

        Then('o campo {string} deve estar destacado como inválido', function (string) {
           // Implementar no frontend
            console.log('Frontend step ainda não implementado');
         });

         Then('o usuário de login {string} existe', async function (login) {
            const user = await userRepository.findOne({ where: { login } });
            if (!user) {throw new Error('Usuário não existe no banco');}
        });