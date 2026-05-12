Feature: Manutenção de usuários
As a administrador
I want to gerenciar usuários
So that eu possa manter as informações atualizadas no sistema

Scenario: Inserir um novo usuário a partir da área de manutenção
Given eu estou logado como "Administrador" com login "Roberto" e senha "Senhaforte1!"
And eu estou na página de "Gerenciamento de usuários"
When eu seleciono "Adicionar usuário"
And eu preencho o campo "Login" com "Carlos1"
And eu preencho o campo "Nome" com "Carlos"
And eu preencho o campo "Senha" com "Senhasupersecreta1!"
And eu preencho o campo "Email" com "Carlinhos@gmail.com"
And eu preencho o campo "Tipo de conta" com "Ouvinte"
And eu seleciono "Salvar"
Then eu vejo uma mensagem na tela de "O usuário foi inserido com sucesso."
And eu devo ver o usuário de login "Carlos1" na lista de usuários

Scenario: Inserir um novo usuário artista a partir da área de manutenção
Given eu estou logado como administrador
And eu estou na página de "Gerenciamento de usuários"
When eu clico na opção "Adicionar usuário"
And eu preencho os dados do usuário com
    |  login  |  nome  |        senha        |      email       |  tipo de conta  |   Descricao   |
    |  abcabc | abc123 | Senhasupersecreta1! | abc123@gmail.com |     Artista     |     xxxxx     |
And eu clico em "Salvar"
Then o usuário deve ser cadastrado com sucesso
And o usuario deve aparecer na lista de usuários
And o usuario deve ser capaz de criar músicas

Scenario: Erro ao inserir um novo usuário com um login já existente
Given eu estou logado como administrador
And já existe um usuário com o login "abcabc"
And eu estou na página de "Gerenciamento de usuários"
When eu clico na opção "Adicionar usuário"
And eu preencho os dados do usuário com
    |  login  |  nome  |        senha        |      email       |  tipo de conta  |   Descricao   |
    |  abcabc | abc123 | Senhasupersecreta1! | abc123@gmail.com |     Artista     |     xxxxx     |
And eu clico em "Salvar"
Then eu vejo uma mensagem na tela dizendo "Já existe um usuário com esse login."
And a lista de usuários permanece a mesma

Scenario: Erro ao não escrever informações válidas para o inserimento de um novo usuário
Given eu estou logado como administrador
And eu estou na página de "Gerenciamento de usuários"
When eu clico na opção "Adicionar usuário"
And eu preencho os dados do usuário com
    |  login  |  nome  | senha |      email       |  tipo de conta  |   Descricao   |
    |         | abc123 | senha | abc123@ggggg.com |     Podcast     |     xxxxx     |
And eu clico em "Salvar"
Then eu vejo uma mensagem na tela dizendo "Preencha os campos com dados válidos para inserir um novo usuário."
And a lista de usuários permanece a mesma

Scenario: Atualizar informações de um usuário existente
Given existe um usuário cadastrado no sistema
And eu estou logado como administrador
And eu estou na página de "Gerenciamento de usuários"
When eu seleciono um usuário da lista de usuários
And eu altero o campo "Nome" do usuário selecionado para "abcabca"
And eu clico em "Salvar"
Then as informações do usuário devem ser atualizadas com sucesso
And o campo que foi alterado deve ser exibido na lista de usuários

Scenario: Erro ao atualizar com um login já existente
Given existe um usuário com o login "abcabc" cadastrado no sistema
And eu estou logado como administrador
And eu estou na página de "Gerenciamento de usuários"
When eu seleciono um usuário da lista de usuários
And eu altero o campo "login" do usuário selecionado para "abcabc"
And eu clico em "Salvar"
Then eu vejo uma mensagem na tela dizendo "Já existe um usuário com esse login."
And nenhuma informação do usuário é alterada

Scenario: Erro ao atualizar uma informação com valor igual ao atual
Given existe um usuário com o nome "abcabc" cadastrado no sistema
And eu estou logado como administrador
And eu estou na página de "Gerenciamento de usuários"
When eu seleciono o usuário com o nome "abcabc" da lista de usuários
And eu altero o campo "Nome" do usuário selecionado para "abcabc"
Then eu vejo uma mensagem de erro informando que o usuário já tem esse nome cadastrado
And a lista de usuários permanece a mesma

Scenario: Remover conta de um usuário existente
Given existe um usuário cadastrado no sistema com o Login "abcabc"
And eu estou logado como administrador
And eu estou na página de "Gerenciamento de usuários"
When eu clico na opção "Remover usuário"
And eu preencho o campo "Login" com "abcabc"
And eu clico em "Remover"
Then a conta do usuário com o Login "abcabc" não deve mais existir no sistema
And eu vejo uma mensagem na tela dizendo que o usuário foi removido

Scenario: Erro ao tentar remover conta de um usuário que não existe
Given não existe um usuário no sistema com o Login "abcabc"
And eu estou logado como administrador
And eu estou na página de "Gerenciamento de usuários"
When eu clico na opção "Remover usuário"
And eu preencho o campo "Login" com "abcabc"
And eu clico em "Remover"
Then eu vejo uma mensagem de erro dizendo que não existe um usuário com o Login "abcabc"
And nenhuma conta deve ser removida do sistema