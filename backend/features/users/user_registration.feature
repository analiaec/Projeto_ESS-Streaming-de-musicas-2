Feature: Cadastro de usuários
As a usuário visitante
I want to cadastrar no serviço de streaming de música
So that eu possa ouvir músicas e podcasts 

Scenario: Cadastro realizado com sucesso
Given não existe uma conta cadastrada com o login "Carlos1"
When eu envio uma solicitação de cadastro com os dados:
    |  login   |  name  |     password        |      email       |  tipodeconta  |
    |  Carlos1 | Carlos | Senhasupersecreta1! | carlos@gmail.com |   OUVINTE     |
Then o usuário "Carlos1" é armazenado corretamente pelo sistema com os campos:
  |  name  |        password     |      email       |    tipodeconta  |
  | Carlos | Senhasupersecreta1! | carlos@gmail.com |     OUVINTE     |
And o sistema retorna a mensagem "Seja bem-vindo ao .WAVe."

Scenario: Tentativa de cadastro com um Login já existente
Given o sistema possui uma conta cadastrada com o login "Carlos1"
When eu envio uma solicitação de cadastro com os dados:
    |  login   |  name  |     password        |      email       |  tipodeconta  |
    |  Carlos1 | Carlos | Senhasupersecreta1! | carlos@gmail.com |   OUVINTE     |
Then o sistema retorna a mensagem "Já existe uma conta com esse Login. Use outro Login."
And o usuário de login "Carlos1" permanece armazenado no sistema

Scenario: Erro exibido quando a senha inserida é muito curta
When eu envio uma solicitação de cadastro com os dados:
    |  login   |  name  |     password        |      email       |  tipodeconta  |
    |  Carlos1 | Carlos |        ab           | carlos@gmail.com |   OUVINTE     |
Then nenhuma conta com o login "Carlos1" é armazenada pelo sistema
And o sistema retorna a mensagem "A senha deve ter pelo menos 3 caracteres. Construa outra senha."

Scenario: Erro ao não preencher todos os campos obrigatórios para o cadastro
When eu envio uma solicitação de cadastro com os dados:
    |  login   |  name  |     password        |      email       |  tipodeconta  |
    |  Carlos1 | Carlos |                     | carlos@gmail.com |   OUVINTE     |
Then nenhuma conta com o login "Carlos1" é armazenada pelo sistema
And o sistema retorna a mensagem "O campo senha não pode estar vazio."

Scenario: Erro ao preencher um campo acima do limite de caracteres
When eu envio uma solicitação de cadastro com os dados:
    |  login   |  name  |             password                    |      email       |  tipodeconta  |
    |  Carlos1 | Carlos |      Senhasupersecreta1!!!!!!!!!!!!!    | carlos@gmail.com |   OUVINTE     |
Then nenhuma conta com o login "Carlos1" é armazenada pelo sistema
And o sistema retorna a mensagem "A senha não pode ter mais de 20 caracteres."

#Scenario: Cadastro de um usuário artista com sucesso
#Given eu estou na página de “Cadastro de usuário”
#And não há nenhum dado preenchido
#When eu preencho os campos com
#    |  login  |  nome  |        senha        |      email       |  tipo de conta  |   Descrição  |
#    |  abcabc | abc123 | Senhasupersecreta1! | abc123@gmail.com |     Artista     |     xxxxx    |
#And eu clico na opção "Finalizar cadastro"
#Then a minha conta de artista é criada com sucesso
#And eu sou redirecionado para a “Página inicial”
#And eu devo ver a mensagem “Seja bem-vindo ao serviço de streaming de música. Estamos ansiosos para ouvir seus hits musicais”
#And eu devo ser capaz de criar músicas ao clicar na opção de "Adicionar músicas"

#Scenario: Cadastro de um usuário podcaster com sucesso
#Given eu estou na página de “Cadastro de usuário”
#And não há nenhum dado preenchido
#When eu preencho os campos com
#    |  login  |  nome  |        senha        |      email       |  tipo de conta  |   Descrição  |
#    |  abcabc | abc123 | Senhasupersecreta1! | abc123@gmail.com |     Podcast     |     xxxxx    |
#And eu clico na opção "Finalizar cadastro"
#Then a minha conta de podcaster é criada com sucesso
#And eu sou redirecionado para a “Página inicial”
#And eu devo ver a mensagem “Seja bem-vindo ao serviço de streaming de música. Estamos ansiosos para ouvir seus podcasts”
#And eu devo ser capaz de criar podcasts ao clicar na opção de "Adicionar podcast"

Scenario: Usuário insere um e-mail inválido
When eu envio uma solicitação de cadastro com os dados:
    |  login   |  name  |             password        |      email           |  tipodeconta  |
    |  Carlos1 | Carlos |      Senhasupersecreta1!    | carlos@gmail |   OUVINTE     |
Then nenhuma conta com o login "Carlos1" é armazenada pelo sistema
And o sistema retorna a mensagem "Voce deve inserir um e-mail válido para realizar o cadastro. Coloque outro e-mail."

