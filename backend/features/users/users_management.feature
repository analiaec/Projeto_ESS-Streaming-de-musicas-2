Feature: Manutenção de usuários
As a administrador
I want to gerenciar usuários
So that eu possa manter as informações atualizadas no sistema

Scenario: Atualizar informações de um usuário existente
Given o sistema possui uma conta cadastrada com os dados:
    |  login   |  name  |     password        |      email       |  tipodeconta  |
    |  admin   | Danilo |     admin123        | danilo@gmail.com |     ADMIN     |
And o usuário "admin" está autenticado no sistema
And o sistema possui uma conta cadastrada com os dados:
    |  login   |  name  |     password        |      email       |  tipodeconta  |
    |  Carlos1 | Carlos | Senhasupersecreta1! | carlos@gmail.com |   OUVINTE     |
When o sistema recebe uma solicitação para atualizar o usuário "Carlos1" com os dados:
    |     name    |     password        |
    |   Roberto   | Senhasupersecreta2! |
Then o sistema retorna a mensagem "Dados atualizados com sucesso."
And o usuário de login "Carlos1" é armazenado corretamente pelo sistema com os campos:
    |     name    |     password        |
    |   Roberto   | Senhasupersecreta2! |

Scenario: Erro ao atualizar informações de um usuário existente com dados inválidos
Given o sistema possui uma conta cadastrada com os dados:
    |  login   |  name  |     password        |      email       |  tipodeconta  |
    |  admin   | Danilo |     admin123        | danilo@gmail.com |     ADMIN     |
And o usuário "admin" está autenticado no sistema
And o sistema possui uma conta cadastrada com os dados:
    |  login   |  name  |     password        |      email       |  tipodeconta  |
    |  Carlos1 | Carlos | Senhasupersecreta1! | carlos@gmail.com |   OUVINTE     |
When o sistema recebe uma solicitação para atualizar o usuário "Carlos1" com os dados:
    |     password        |
    |        ab           |
Then o sistema retorna a mensagem "A senha deve ter pelo menos 3 caracteres. Construa outra senha."
And o sistema não altera os dados do usuário "Carlos1"

Scenario: Erro ao atualizar uma informação com valor igual ao atual
Given o sistema possui uma conta cadastrada com os dados:
    |  login   |  name  |     password        |      email       |  tipodeconta  |
    |  admin   | Danilo |     admin123        | danilo@gmail.com |     ADMIN     |
And o usuário "admin" está autenticado no sistema
And o sistema possui uma conta cadastrada com os dados:
    |  login   |  name  |     password        |      email       |  tipodeconta  |
    |  Carlos1 | Carlos | Senhasupersecreta1! | carlos@gmail.com |   OUVINTE     |
When o sistema recebe uma solicitação para atualizar o usuário "Carlos1" com os dados:
    |     password        |
    | Senhasupersecreta1! |
Then o sistema retorna a mensagem "Não é possível atualizar os seguintes campos com o mesmo valor atual: senha."
And o sistema não altera os dados do usuário "Carlos1"

Scenario: Remover conta de um usuário existente
Given o sistema possui uma conta cadastrada com os dados:
    |  login   |  name  |     password        |      email       |  tipodeconta  |
    |  admin   | Danilo |     admin123        | danilo@gmail.com |     ADMIN     |
And o usuário "admin" está autenticado no sistema
And o sistema possui uma conta cadastrada com os dados:
    |  login   |  name  |     password        |      email       |  tipodeconta  |
    |  Carlos1 | Carlos | Senhasupersecreta1! | carlos@gmail.com |   OUVINTE     |
When o sistema recebe uma solicitação para remover o usuário "Carlos1"
Then o sistema retorna a mensagem "A conta foi removida do sistema com sucesso."
And o usuário de login "Carlos1" não deve mais existir no sistema

Scenario: Não permitir que um usuário comum atualize os dados de outro usuário
Given o sistema possui uma conta cadastrada com os dados:
    | login   | name   | password             | email                | tipodeconta |
    | Carlos1 | Carlos | Senhasupersecreta1!  | carlos@gmail.com     | OUVINTE     |
And o usuário "Carlos1" está autenticado no sistema
And o sistema possui uma conta cadastrada com os dados:
    | login   | name   | password             | email                | tipodeconta |
    | Maria1  | Maria  | Senhasupersecreta2!  | maria@gmail.com      | OUVINTE     |
When o sistema recebe uma solicitação para atualizar o usuário "Maria1" com os dados:
    | name        |
    | Maria Silva |
Then o sistema retorna a mensagem "Você não possui permissão para realizar esta ação."
And o sistema não altera os dados do usuário "Maria1"

Scenario: Não permitir que um usuário comum remova a conta de outro usuário
Given o sistema possui uma conta cadastrada com os dados:
    | login   | name   | password             | email                | tipodeconta |
    | Carlos1 | Carlos | Senhasupersecreta1!  | carlos@gmail.com     | OUVINTE     |
And o sistema possui uma conta cadastrada com os dados:
    | login   | name   | password             | email                | tipodeconta |
    | Maria1  | Maria  | Senhasupersecreta2!  | maria@gmail.com      | OUVINTE     |
And o usuário "Carlos1" está autenticado no sistema
When o sistema recebe uma solicitação para remover o usuário "Maria1"
Then o sistema retorna a mensagem "Você não possui permissão para realizar esta ação."
And o sistema não altera os dados do usuário "Maria1"
