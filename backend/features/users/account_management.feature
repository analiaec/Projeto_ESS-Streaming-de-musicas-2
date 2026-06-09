Feature: Manutenção de conta
As a usuário
I want to ser capaz de atualizar ou remover  minha conta
So that eu possa gerenciar a minha conta

Scenario: Atualização de informações da conta
Given o sistema possui uma conta cadastrada com os dados:
    |  login   |  name  |     password        |      email       |  tipodeconta  |
    |  Carlos1 | Carlos | Senhasupersecreta1! | carlos@gmail.com |   OUVINTE     |
And o usuário "Carlos1" está autenticado no sistema
When o sistema recebe uma solicitação para atualizar o usuário "Carlos1" com os dados:
    |     name    |     password        |
    |   Roberto   | Senhasupersecreta2! |
Then o sistema retorna a mensagem "Dados atualizados com sucesso."
And o usuário de login "Carlos1" é armazenado corretamente pelo sistema com os campos:
    |     name    |     password        |
    |   Roberto   | Senhasupersecreta2! |

Scenario: Não permitir atualização com valor igual ao atual
Given o sistema possui uma conta cadastrada com os dados:
    |  login   |  name  |     password        |      email       |  tipodeconta  |
    |  Carlos1 | Carlos | Senhasupersecreta1! | carlos@gmail.com |   OUVINTE     |
And o usuário "Carlos1" está autenticado no sistema
When o sistema recebe uma solicitação para atualizar o usuário "Carlos1" com os dados:
    |     password        |
    | Senhasupersecreta1! |
Then o sistema retorna a mensagem "Não é possível atualizar os seguintes campos com o mesmo valor atual: senha."
And o sistema não altera os dados do usuário "Carlos1"

Scenario: Não permitir atualização de informação com um valor inválido
Given o sistema possui uma conta cadastrada com os dados:
    |  login   |  name  |     password        |      email       |  tipodeconta  |
    |  Carlos1 | Carlos | Senhasupersecreta1! | carlos@gmail.com |   OUVINTE     |
And o usuário "Carlos1" está autenticado no sistema
When o sistema recebe uma solicitação para atualizar o usuário "Carlos1" com os dados:
    |     password        |
    |        ab           |
Then o sistema retorna a mensagem "A senha deve ter pelo menos 3 caracteres. Construa outra senha."
And o sistema não altera os dados do usuário "Carlos1"

Scenario: Atualização de informação da conta sem preencher valores
Given o sistema possui uma conta cadastrada com os dados:
    |  login   |  name  |     password        |      email       |  tipodeconta  |
    |  Carlos1 | Carlos | Senhasupersecreta1! | carlos@gmail.com |   OUVINTE     |
And o usuário "Carlos1" está autenticado no sistema
When o sistema recebe uma solicitação para atualizar o usuário "Carlos1" sem informar dados
Then o sistema retorna a mensagem "Não é possível realizar uma atualização sem preencher nenhum campo."
And o sistema não altera os dados do usuário "Carlos1"

Scenario: Remover a conta do serviço de streaming de música
Given o sistema possui uma conta cadastrada com os dados:
    |  login   |  name  |     password        |      email       |  tipodeconta  |
    |  Carlos1 | Carlos | Senhasupersecreta1! | carlos@gmail.com |   OUVINTE     |
And o usuário "Carlos1" está autenticado no sistema
When o sistema recebe uma solicitação para remover o usuário "Carlos1" com os dados:
    |     password        |
    | Senhasupersecreta1! |
Then o sistema retorna a mensagem "A conta foi removida do sistema com sucesso."
And o usuário de login "Carlos1" não deve mais existir no sistema

Scenario: Erro ao não inserir a senha correta para remover conta
Given o sistema possui uma conta cadastrada com os dados:
    |  login   |  name  |     password        |      email       |  tipodeconta  |
    |  Carlos1 | Carlos | Senhasupersecreta1! | carlos@gmail.com |   OUVINTE     |
And o usuário "Carlos1" está autenticado no sistema
When o sistema recebe uma solicitação para remover o usuário "Carlos1" com os dados:
    |     password        |
    |       abss          |
Then o sistema retorna a mensagem "Senha incorreta. Insira a senha correta para realizar a remoção da conta."
And o sistema não altera os dados do usuário "Carlos1"
