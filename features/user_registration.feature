Feature: Cadastro de usuários
As a usuário visitante
I want to cadastrar no serviço de streaming de música
So that eu possa ouvir músicas e podcasts 

Scenario: Cadastro realizado com sucesso
Given eu estou na página de “Cadastro de usuário”
When eu preencho o campo "Login" com "Carlos1"
And eu preencho o campo "Nome" com "Carlos"
And eu preencho o campo "Senha" com "Senhasupersecreta1!"
And eu preencho o campo "Email" com "Carlinhos@gmail.com"
And eu preencho o campo "Tipo de conta" com "Ouvinte"
And eu seleciono “Finalizar cadastro”
Then o usuário de login "Carlos1" existe com o nome "Carlos" e senha "Senhasupersecreta1!" e email "Carlinhos@gmail.com" e tipo de conta "Ouvinte"
And eu vou para a “Página inicial”
And eu vejo uma mensagem na tela de "Seja bem-vindo ao .WAVe."

Scenario: Tentativa de cadastro com um Login já existente
Given existe uma conta já cadastrada com o Login “Carlos1”
And eu estou na página de "Cadastro de usuário"
When eu preencho o campo "Login" com "Carlos1"
And eu preencho o campo "Nome" com "Carlos"
And eu preencho o campo "Senha" com "Senhasupersecreta1!"
And eu preencho o campo "Email" com "Carlinhos@gmail.com"
And eu preencho o campo "Tipo de conta" com "Ouvinte"
And eu seleciono “Finalizar cadastro”
Then eu vejo uma mensagem na tela de “Já existe uma conta com esse Login. Use outro Login.”
And o campo "Login" deve estar destacado como inválido
And o usuário de login "Carlos1" existe

Scenario: Erro exibido quando a senha inserida é muito curta
Given eu estou na página de “Cadastro de usuário”
When eu preencho o campo "Login" com "Carlos1"
And eu preencho o campo "Nome" com "Carlos"
And eu preencho o campo "Senha" com "ab"
And eu preencho o campo "Email" com "Carlinhos@gmail.com"
And eu preencho o campo "Tipo de conta" com "Ouvinte"
And eu seleciono “Finalizar cadastro”
Then eu vejo uma mensagem na tela de “A senha deve ter pelo menos 3 caracteres. Construa outra senha.”
And o campo "Senha" deve estar destacado como inválido

Scenario: Erro ao não preencher todos os campos obrigatórios para o cadastro
Given eu estou na página de “Cadastro de usuário”
And eu deixo todos os campos de cadastro vazios
And eu seleciono “Finalizar cadastro”
Then eu vejo uma mensagem na tela de “Todos os campos obrigatórios devem ser preenchidos para o cadastro ser finalizado.”
And o campo "Login" deve estar destacado como inválido
And o campo "Nome" deve estar destacado como inválido
And o campo "Senha" deve estar destacado como inválido
And o campo "Email" deve estar destacado como inválido
And o campo "Tipo de conta" deve estar destacado como inválido

Scenario: Erro ao preencher um campo acima do limite de caracteres
Given eu estou na página de “Cadastro de usuário”
When eu preencho o campo "Login" com "Carlos1"
And eu preencho o campo "Nome" com "Carlos"
And eu preencho o campo "Senha" com "Senhasupersecreta1!!!!!!!!!!!"
And eu preencho o campo "Email" com "Carlinhos@gmail.com"
And eu preencho o campo "Tipo de conta" com "Ouvinte"
And eu seleciono “Finalizar cadastro”
Then eu vejo uma mensagem na tela de "Voce ultrapassou o limite de 20 caracteres no campo senha. Construa uma senha mais curta."
And o campo "Senha" deve estar destacado como inválido

Scenario: Cadastro de um usuário artista com sucesso
Given eu estou na página de “Cadastro de usuário”
And não há nenhum dado preenchido
When eu preencho os campos com
    |  login  |  nome  |        senha        |      email       |  tipo de conta  |   Descrição  |
    |  abcabc | abc123 | Senhasupersecreta1! | abc123@gmail.com |     Artista     |     xxxxx    |
And eu clico na opção "Finalizar cadastro"
Then a minha conta de artista é criada com sucesso
And eu sou redirecionado para a “Página inicial”
And eu devo ver a mensagem “Seja bem-vindo ao serviço de streaming de música. Estamos ansiosos para ouvir seus hits musicais”
And eu devo ser capaz de criar músicas ao clicar na opção de "Adicionar músicas"

Scenario: Cadastro de um usuário podcaster com sucesso
Given eu estou na página de “Cadastro de usuário”
And não há nenhum dado preenchido
When eu preencho os campos com
    |  login  |  nome  |        senha        |      email       |  tipo de conta  |   Descrição  |
    |  abcabc | abc123 | Senhasupersecreta1! | abc123@gmail.com |     Podcast     |     xxxxx    |
And eu clico na opção "Finalizar cadastro"
Then a minha conta de podcaster é criada com sucesso
And eu sou redirecionado para a “Página inicial”
And eu devo ver a mensagem “Seja bem-vindo ao serviço de streaming de música. Estamos ansiosos para ouvir seus podcasts”
And eu devo ser capaz de criar podcasts ao clicar na opção de "Adicionar podcast"

Scenario: Usuário insere um e-mail inválido
Given eu estou na página de "Cadastro de usuário"
When eu preencho o campo "Login" com "Carlos1"
And eu preencho o campo "Nome" com "Carlos"
And eu preencho o campo "Senha" com "Senhasupersecreta1!"
And eu preencho o campo "Email" com "Carlinhos@gmail.com"
And eu preencho o campo "Tipo de conta" com "Ouvinte"
And eu seleciono “Finalizar cadastro”
Then eu vejo uma mensagem na tela de "Voce deve inserir um e-mail válido para realizar o cadastro. Coloque outro e-mail."
And o campo "Email" deve estar destacado como inválido