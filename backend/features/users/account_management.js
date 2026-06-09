const {Given, When, Then, BeforeAll, AfterAll, Before} = require('@cucumber/cucumber')
const {AppModule} = require('../../src/app.module');
const { Test } = require('@nestjs/testing');
const { User } = require('../../src/users/entities/user.entity');
const { DataSource } = require('typeorm');
const {ValidationPipe} = require('@nestjs/common')
const request = require('supertest');
const assert = require('assert')
let requestbody = {};
let app;
let userRepository;
let dataSource;
let token;
let originalUser;

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
            token = undefined;
            this.response = undefined;
            requestbody = {};
            if (dataSource && dataSource.isInitialized) {
            try {
                await dataSource.query('TRUNCATE TABLE "user" CASCADE;');
            } catch (error) {
                await dataSource.query('TRUNCATE TABLE "users" CASCADE;');
        }}});

        Given('o sistema possui uma conta cadastrada com os dados:',
        async function (dataTable) {
            const userData = dataTable.hashes()[0];
            originalUser = {...userData};
            await userRepository.save(userData);
        },);

        Given('o usuário {string} está autenticado no sistema',
        async function (login) {
            const user = await userRepository.findOneBy({ login });
            const loginResponse = await request(app.getHttpServer())
            .post('/api/auth/login')
            .send({
                login: user.login,
                password: user.password,
            });
            token = loginResponse.body.access_token;
        },);

        When('o sistema recebe uma solicitação para atualizar o usuário {string} com os dados:',
        async function (login, dataTable) {
            requestbody = dataTable.hashes()[0];
            this.response = await request(app.getHttpServer())
            .patch(`/api/users/${login}`)
            .set('Authorization', `Bearer ${token}`)
            .send(requestbody);
        },);

        When('o sistema recebe uma solicitação para atualizar o usuário {string} sem informar dados',
        async function (login) {
            this.response = await request(app.getHttpServer())
            .patch(`/api/users/${login}`)
            .set('Authorization', `Bearer ${token}`)
            .send({});
        },);

        When('o sistema recebe uma solicitação para remover o usuário {string} com os dados:',
        async function (login, dataTable) {
            requestbody = dataTable.hashes()[0];
            this.response = await request(app.getHttpServer())
            .delete(`/api/users/${login}`)
            .set('Authorization', `Bearer ${token}`)
            .send(requestbody);
        },);

        When('o sistema recebe uma solicitação para remover o usuário {string}',
        async function (login) {
            this.response = await request(app.getHttpServer())
            .delete(`/api/users/${login}`)
            .set('Authorization', `Bearer ${token}`)
            .send({});
        },);

        Then('o sistema não altera os dados do usuário {string}',
        async function (login) {
            const user = await userRepository.findOneBy({ login });
            assert.strictEqual(user.name, originalUser.name);
            assert.strictEqual(user.password, originalUser.password);
            assert.strictEqual(user.email, originalUser.email);
            assert.strictEqual(user.tipodeconta, originalUser.tipodeconta);
        },);

        Then('o usuário de login {string} não deve mais existir no sistema',
        async function (login) {
            const user = await userRepository.findOneBy({ login });
            assert.strictEqual(user, null);
        },);
