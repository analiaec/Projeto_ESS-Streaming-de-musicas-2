const {Given, When, Then, BeforeAll, AfterAll} = require('@cucumber/cucumber')
const {AppModule} = require('../../src/app.module');
const { Test } = require('@nestjs/testing');
const { getRepositoryToken } = require('@nestjs/typeorm');
const { User } = require('../../src/users/entities/user.entity');
console.log(AppModule);
const request = require('supertest');
let requestbody = {};
let response;
let app;
let userRepository;

        BeforeAll(async function () {
            const moduleRef = await Test.createTestingModule({imports: [AppModule],}).compile();
            app = moduleRef.createNestApplication();
            userRepository = moduleRef.get(getRepositoryToken(User));
            await app.init();
        });
        
        AfterAll(async function () {
            await app.close();
        });

         Given('eu estou na página de {string}', function (string) {
           // Implementar mais tarde no frontend
           requestbody = {}; //apenas para inicializar contexto
           //return 'pending';
         });
          
         When('eu preencho os campos com:', function (dataTable) {
            // Pega a primeira linha da tabela e transforma em objeto
            requestBody = dataTable.hashes()[0];
        });
  
        When('eu seleciono {string}', async function (acao) {
            if (acao === 'Finalizar cadastro') {
            response = await request(app.getHttpServer())
            .post('/auth/register')
            .send(requestBody);
        }});
       
         Then('o usuário de login {string} existe com os campos:', async function (login, dataTable) {
            const esperado = dataTable.hashes()[0];
            // Busca usuário no banco
            const usuario = await userRepository.findOne({where: { login },});
            if (!usuario) {throw new Error('Usuário não encontrado');}
            // Valida cada campo da tabela dinamicamente
            for (const campo in esperado) {
            if (usuario[campo] != esperado[campo]) {throw new Error(`Campo ${campo} incorreto`,);}
            }
        });
       
         Then('eu vou para a {string}', function (pagina) {
            if (pagina === 'Página inicial') {
            if (response.status !== 201) {throw new Error('Não foi para a página inicial',);}
        }});
       
         Then('eu vejo uma mensagem na tela de {string}', function (mensagemEsperada) {
            if (response.body.message !== mensagemEsperada) {throw new Error('Mensagem incorreta',);}
        });