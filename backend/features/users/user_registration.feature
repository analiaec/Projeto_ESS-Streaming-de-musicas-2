Feature: Cadastro de usuários
As a usuário visitante
I want to cadastrar no serviço de streaming de música
So that eu possa ouvir músicas e podcasts

Scenario: Cadastro realizado com sucesso
Given não existe uma conta cadastrada com o login "Carlos1"
When eu envio uma solicitação de cadastro com os dados:
    |  login   |  name  |     password        |      email       |  tipodeconta  |
    |  Carlos1 | Carlos | Senhasupersecreta1! | carlos@gmail.com |   OUVINTE     |
Then o usuário de login "Carlos1" é armazenado corretamente pelo sistema com os campos:
  |  name  |        password     |      email       |    tipodeconta  |
  | Carlos | Senhasupersecreta1! | carlos@gmail.com |     OUVINTE     |
And o sistema retorna a mensagem "Seja bem-vindo ao .WAVe."

Scenario: Tentativa de cadastro com um Login já existente
Given o sistema possui uma conta cadastrada com os dados:
    |  login   |  name  |     password        |      email       |  tipodeconta  |
    |  Carlos1 | Carlos | Senhasupersecreta1! | carlos@gmail.com |   OUVINTE     |
When eu envio uma solicitação de cadastro com os dados:
    |  login   |  name  |     password        |      email       |  tipodeconta  |
    |  Carlos1 | Carlos | Senhasupersecreta1! | carlos@gmail.com |   OUVINTE     |
Then o sistema retorna a mensagem "Já existe uma conta com esse Login. Use outro Login."
And o usuário de login "Carlos1" permanece armazenado no sistema

Scenario: Erro exibido quando a senha inserida é muito curta
Given não existe uma conta cadastrada com o login "Carlos1"
When eu envio uma solicitação de cadastro com os dados:
    |  login   |  name  |     password        |      email       |  tipodeconta  |
    |  Carlos1 | Carlos |        ab           | carlos@gmail.com |   OUVINTE     |
Then nenhuma conta com o login "Carlos1" é armazenada pelo sistema
And o sistema retorna a mensagem "A senha deve ter pelo menos 3 caracteres. Construa outra senha."

Scenario: Erro ao não preencher todos os campos obrigatórios para o cadastro
Given não existe uma conta cadastrada com o login "Carlos1"
When eu envio uma solicitação de cadastro com os dados:
    |  login   |  name  |     password        |      email       |  tipodeconta  |
    |  Carlos1 | Carlos |                     | carlos@gmail.com |   OUVINTE     |
Then nenhuma conta com o login "Carlos1" é armazenada pelo sistema
And o sistema retorna a mensagem "O campo senha não pode estar vazio."

Scenario: Erro ao preencher um campo acima do limite de caracteres
Given não existe uma conta cadastrada com o login "Carlos1"
When eu envio uma solicitação de cadastro com os dados:
    |  login   |  name  |             password                    |      email       |  tipodeconta  |
    |  Carlos1 | Carlos |      Senhasupersecreta1!!!!!!!!!!!!!    | carlos@gmail.com |   OUVINTE     |
Then nenhuma conta com o login "Carlos1" é armazenada pelo sistema
And o sistema retorna a mensagem "A senha não pode ter mais de 20 caracteres."

Scenario: Usuário insere um e-mail inválido
Given não existe uma conta cadastrada com o login "Carlos1"
When eu envio uma solicitação de cadastro com os dados:
    |  login   |  name  |             password        |      email           |  tipodeconta  |
    |  Carlos1 | Carlos |      Senhasupersecreta1!    | carlos@gmail |   OUVINTE     |
Then nenhuma conta com o login "Carlos1" é armazenada pelo sistema
And o sistema retorna a mensagem "Voce deve inserir um e-mail válido para realizar o cadastro. Coloque outro e-mail."
