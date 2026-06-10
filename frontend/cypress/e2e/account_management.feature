Feature: Manutenção de conta
As a usuário
I want to ser capaz de atualizar ou desligar minha conta
So that eu possa gerenciar a minha conta

Scenario: Acessar a página de atualização da conta
Given existe uma conta cadastrada com os dados:
| login   |  name  |      password       |      email       | tipodeconta |
| Carlos1 | Carlos | Senhasupersecreta1! | carlos@gmail.com |   OUVINTE   |
And o usuário "Carlos1" está autenticado
And o usuário está na página de "Configurações"
When o usuário clica no botão de "Editar dados"
Then o usuário deve ser redirecionado para a página de "Atualizar Conta"

Scenario: Acessar a página de remoção da conta
Given existe uma conta cadastrada com os dados:
| login   |  name  |      password       |      email       | tipodeconta |
| Carlos1 | Carlos | Senhasupersecreta1! | carlos@gmail.com |   OUVINTE   |
And o usuário "Carlos1" está autenticado
And o usuário está na página de "Configurações"
When o usuário clica no botão de "Excluir conta"
Then o usuário deve ser redirecionado para a página de "Remover Conta"

Scenario: Atualização de informações da conta
Given existe uma conta cadastrada com os dados:
| login   |  name  |      password       |      email       | tipodeconta |
| Carlos1 | Carlos | Senhasupersecreta1! | carlos@gmail.com |   OUVINTE   |
And o usuário "Carlos1" está autenticado
And o usuário está na página de "Atualizar Conta"
When o usuário preenche os campos com:
|   name  |      password       |
| Roberto | Senhasupersecreta2! |
And o usuário clica no botão de "Salvar"
Then o usuário deve ver a mensagem de confirmação "Dados atualizados com sucesso!"
And o usuário deve ser redirecionado para a página de "Configurações"
And o usuário deve ver os dados da conta:
| login   |  name   |      email       | tipodeconta |
| Carlos1 | Roberto | carlos@gmail.com |   OUVINTE   |
And o usuário deve conseguir autenticar com a nova senha "Senhasupersecreta2!"

Scenario: Não permitir atualização com valor igual ao atual
Given existe uma conta cadastrada com os dados:
| login   |  name  |      password       |      email       | tipodeconta |
| Carlos1 | Carlos | Senhasupersecreta1! | carlos@gmail.com |   OUVINTE   |
And o usuário "Carlos1" está autenticado
And o usuário está na página de "Atualizar Conta"
When o usuário preenche os campos com:
|       password      |
| Senhasupersecreta1! |
And o usuário clica no botão de "Salvar"
Then o usuário deve ver a mensagem de erro "Não é possível atualizar os seguintes campos com o mesmo valor atual: senha."
And o usuário continua na página de "Atualizar Conta"
And o formulário não é enviado com sucesso

Scenario: Não permitir atualização de informação com um valor inválido
Given existe uma conta cadastrada com os dados:
| login   |  name  |      password       |      email       | tipodeconta |
| Carlos1 | Carlos | Senhasupersecreta1! | carlos@gmail.com |   OUVINTE   |
And o usuário "Carlos1" está autenticado
And o usuário está na página de "Atualizar Conta"
When o usuário preenche os campos com:
| password |
|    ab    |
And o usuário clica no botão de "Salvar"
Then o usuário deve ver a mensagem de erro "A senha deve ter pelo menos 3 caracteres. Construa outra senha."
And o usuário continua na página de "Atualizar Conta"
And o formulário não é enviado com sucesso

Scenario: Atualização de informação da conta sem preencher valores
Given existe uma conta cadastrada com os dados:
| login   |  name  |      password       |      email       | tipodeconta |
| Carlos1 | Carlos | Senhasupersecreta1! | carlos@gmail.com |   OUVINTE   |
And o usuário "Carlos1" está autenticado
And o usuário está na página de "Atualizar Conta"
When o usuário clica no botão de "Salvar"
Then o usuário deve ver a mensagem de erro "Preencha pelo menos um campo para atualizar."
And o usuário continua na página de "Atualizar Conta"
And o formulário não é enviado com sucesso

Scenario: Remover a conta do serviço de streaming de música
Given existe uma conta cadastrada com os dados:
| login   |  name  |      password       |      email       | tipodeconta |
| Carlos1 | Carlos | Senhasupersecreta1! | carlos@gmail.com |   OUVINTE   |
And o usuário "Carlos1" está autenticado
And o usuário está na página de "Remover Conta"
And o usuário preenche os campos com:
|       password      |
| Senhasupersecreta1! |
And o usuário clica no botão de "Excluir minha conta"
Then o usuário deve ver a mensagem de confirmação "Conta excluída. Até logo!"
And o usuário deve ser redirecionado para a página de "Home"
And o usuário não está mais autenticado no sistema

Scenario: Erro ao não inserir a senha correta para remover conta
Given existe uma conta cadastrada com os dados:
| login   |  name  |      password       |      email       | tipodeconta |
| Carlos1 | Carlos | Senhasupersecreta1! | carlos@gmail.com |   OUVINTE   |
And o usuário "Carlos1" está autenticado
And o usuário está na página de "Remover Conta"
When o usuário preenche os campos com:
| password |
|   abss   |
And o usuário clica no botão de "Excluir minha conta"
Then o usuário deve ver a mensagem de erro "Senha incorreta. Insira a senha correta para realizar a remoção da conta."
And o usuário continua na página de "Remover Conta"
And o formulário não é enviado com sucesso