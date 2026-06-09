Feature: Cadastro de usuários
As a usuário visitante
I want to cadastrar no serviço de streaming de música
So that eu possa ouvir músicas e podcasts

Scenario: Cadastro realizado com sucesso
Given o usuário está na página de "Cadastro"
When o usuário preenche os campos com:
    |  login   |  name  |     password        |      email       |  tipodeconta  |
    |  Carlos1 | Carlos | Senhasupersecreta1! | carlos@gmail.com |   OUVINTE     |
And o usuário clica no botão de "Criar conta"
Then o usuário deve ver a mensagem de confirmação "Conta criada com sucesso! Faça login para continuar."
And o usuário deve ser redirecionado para a página de "Login"

Scenario: Tentativa de cadastro com um Login já existente
Given existe uma conta já cadastrada com o Login "Carlos1"
And o usuário está na página de "Cadastro"
When o usuário preenche os campos com:
    |  login   |  name  |     password        |      email       |  tipodeconta  |
    |  Carlos1 | Carlos | Senhasupersecreta1! | carlos@gmail.com |   OUVINTE     |
And o usuário clica no botão de "Criar conta"
Then o usuário deve ver a mensagem de erro "Já existe uma conta com esse Login. Use outro Login."
And o usuário continua na página de "Cadastro"
And o formulário não é enviado com sucesso

Scenario: Erro exibido quando a senha inserida é muito curta
Given o usuário está na página de "Cadastro"
When o usuário preenche os campos com:
    |  login   |  name  |     password        |      email       |  tipodeconta  |
    |  Carlos1 | Carlos |        ab           | carlos@gmail.com |   OUVINTE     |
And o usuário clica no botão de "Criar conta"
Then o usuário deve ver a mensagem de erro "A senha deve ter pelo menos 3 caracteres. Construa outra senha."
And o usuário continua na página de "Cadastro"
And o formulário não é enviado com sucesso

Scenario: Erro ao não preencher todos os campos obrigatórios para o cadastro
Given o usuário está na página de "Cadastro"
When o usuário preenche os campos com:
    |  login   |  name  |     password        |      email       |  tipodeconta  |
    |  Carlos1 | Carlos |                     | carlos@gmail.com |   OUVINTE     |
And o usuário clica no botão de "Criar conta"
Then o usuário deve ver a mensagem de erro "Preencha todos os campos obrigatórios."
And o usuário continua na página de "Cadastro"
And o formulário não é enviado com sucesso

Scenario: Erro ao preencher um campo acima do limite de caracteres
Given o usuário está na página de "Cadastro"
When o usuário preenche os campos com:
    |  login   |  name  |        password        |      email       |  tipodeconta  |
    |  Carlos1 | Carlos | Senhasupersecreta1!!!!!| carlos@gmail.com |   OUVINTE     |
And o usuário clica no botão de "Criar conta"
Then o usuário deve ver a mensagem de erro "A senha não pode ter mais de 20 caracteres."
And o usuário continua na página de "Cadastro"
And o formulário não é enviado com sucesso

Scenario: Usuário insere um e-mail inválido
Given o usuário está na página de "Cadastro"
When o usuário preenche os campos com:
    |  login   |  name  |     password        |      email       |  tipodeconta  |
    |  Carlos1 | Carlos | Senhasupersecreta1! |   carlos@gmail   |   OUVINTE     |
And o usuário clica no botão de "Criar conta"
Then o usuário deve ver a mensagem de erro "Voce deve inserir um e-mail válido para realizar o cadastro. Coloque outro e-mail."
And o usuário continua na página de "Cadastro"
And o formulário não é enviado com sucesso