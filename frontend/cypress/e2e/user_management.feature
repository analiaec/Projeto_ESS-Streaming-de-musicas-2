Feature: Manutenção de usuários
As a administrador
I want to gerenciar usuários
So that eu possa manter as informações atualizadas no sistema

Scenario: Atualizar informações de um usuário existente
Given existe uma conta cadastrada com os dados:
| login | name   | password |      email        | tipodeconta |
| admin | Danilo | admin123 | danilo@gmail.com  |    ADMIN    |
And existe uma conta cadastrada com os dados:
| login   | name   |      password        |      email         | tipodeconta |
| Carlos1 | Carlos | Senhasupersecreta1!  | carlos@gmail.com   |   OUVINTE   |
And o usuário "admin" está autenticado
And o usuário está na página de "Gerenciar Usuários"
When o usuário seleciona "Editar" para a conta de login "Carlos1"
And o usuário preenche os campos com:
|   name  |     password         |
| Roberto | Senhasupersecreta2!  |
And o usuário clica no botão de "Salvar"
Then o usuário deve ver a mensagem de confirmação "Usuário atualizado com sucesso."
And o usuário deve ver os dados da conta:
| login   | name    |      password        |      email         | tipodeconta |
| Carlos1 | Roberto | Senhasupersecreta2!  | carlos@gmail.com   |   OUVINTE   |

Scenario: Erro ao atualizar informações de um usuário existente com dados inválidos
Given existe uma conta cadastrada com os dados:
| login | name   | password |      email        | tipodeconta |
| admin | Danilo | admin123 | danilo@gmail.com  |    ADMIN    |
And existe uma conta cadastrada com os dados:
| login   | name   |      password        |      email         | tipodeconta |
| Carlos1 | Carlos | Senhasupersecreta1!  | carlos@gmail.com   |   OUVINTE   |
And o usuário "admin" está autenticado
And o usuário está na página de "Gerenciar Usuários"
When o usuário seleciona "Editar" para a conta de login "Carlos1"
And o usuário preenche os campos com:
| password |
|    ab    |
And o usuário clica no botão de "Salvar"
Then o usuário deve ver a mensagem de erro "A senha deve ter pelo menos 3 caracteres. Construa outra senha."
And o usuário continua na página de "Gerenciar Usuários"
And o formulário não é enviado com sucesso

Scenario: Erro ao atualizar uma informação com valor igual ao atual
Given existe uma conta cadastrada com os dados:
| login | name   | password |      email        | tipodeconta |
| admin | Danilo | admin123 | danilo@gmail.com  |    ADMIN    |
And existe uma conta cadastrada com os dados:
| login   | name   |      password        |      email         | tipodeconta |
| Carlos1 | Carlos | Senhasupersecreta1!  | carlos@gmail.com   |   OUVINTE   |
And o usuário "admin" está autenticado
And o usuário está na página de "Gerenciar Usuários"
When o usuário seleciona "Editar" para a conta de login "Carlos1"
And o usuário preenche os campos com:
|      password        |
| Senhasupersecreta1!  |
And o usuário clica no botão de "Salvar"
Then o usuário deve ver a mensagem de erro "Não é possível atualizar os seguintes campos com o mesmo valor atual: senha."
And o usuário continua na página de "Gerenciar Usuários"
And o formulário não é enviado com sucesso

Scenario: Remover conta de um usuário existente
Given existe uma conta cadastrada com os dados:
| login | name   | password |      email        | tipodeconta |
| admin | Danilo | admin123 | danilo@gmail.com  |    ADMIN    |
And existe uma conta cadastrada com os dados:
| login   | name   |      password        |      email         | tipodeconta |
| Carlos1 | Carlos | Senhasupersecreta1!  | carlos@gmail.com   |   OUVINTE   |
And o usuário "admin" está autenticado
And o usuário está na página de "Gerenciar Usuários"
When o usuário seleciona "Excluir" para a conta de login "Carlos1"
Then o usuário deve ver a mensagem de confirmação "Usuário @Carlos1 excluído."
And o usuário continua na página de "Gerenciar Usuários"
And a conta de login "Carlos1" não deve mais aparecer na tabela de usuários

Scenario: Cancelar remoção de conta de um usuário
Given existe uma conta cadastrada com os dados:
| login | name   | password |      email        | tipodeconta |
| admin | Danilo | admin123 | danilo@gmail.com  |    ADMIN    |
And existe uma conta cadastrada com os dados:
| login   | name   |      password        |      email         | tipodeconta |
| Carlos1 | Carlos | Senhasupersecreta1!  | carlos@gmail.com   |   OUVINTE   |
And o usuário "admin" está autenticado
And o usuário está na página de "Gerenciar Usuários"
When o usuário cancela a remoção de "Carlos1"
Then a conta de login "Carlos1" deve continuar na tabela de usuários
And o usuário continua na página de "Gerenciar Usuários"

Scenario: Usuário comum não visualiza a opção de gerenciamento de usuários
Given existe uma conta cadastrada com os dados:
| login   | name   | password             | email            | tipodeconta |
| Carlos1 | Carlos | Senhasupersecreta1!  | carlos@gmail.com | OUVINTE     |
And o usuário "Carlos1" está autenticado
When o usuário acessa a página de "Home"
Then o usuário não deve visualizar a opção "Admin"
