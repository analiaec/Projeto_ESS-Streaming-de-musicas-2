Feature: Manutenção de conta
As a usuário
I want to ser capaz de atualizar ou desligar minha conta
So that eu possa gerenciar a minha conta

Scenario: Atualização de uma informação da conta
Given eu estou logado como "Ouvinte" com nome "Carlos" e senha "Senhasupersecreta1!" e login "Carlos1"
And eu estou na página de "Página inicial"
When eu seleciono "Atualizar conta"
And eu preencho o campo "Senha" com "Senhasupersecreta2!"
And eu preencho o campo "Senha atual" com "Senhasupersecreta1!"
And eu seleciono "Confirmar"
Then eu vejo uma mensagem na tela de "Sua conta foi atualizada com sucesso."
And o usuário de login "Carlos1" existe com a senha "Senhasupersecreta2!"

Scenario: Não permitir atualização com valor igual ao atual
Given eu estou logado como "Ouvinte" com nome "Carlos" e senha "Senhasupersecreta1!" e login "Carlos1"
And eu estou na página de "Página inicial”
When eu seleciono "Atualizar conta"
And eu preencho o campo "Nome" com "Carlos"
And eu preencho o campo "Senha atual" com "Senhasupersecreta1!"
And eu seleciono "Confirmar"
Then eu vejo uma mensagem na tela de "Preencha o campo nome com um valor que não seja o nome atual."
And o usuário de login "Carlos1" existe com o nome "Carlos"
And o campo "Nome" deve estar destacado como inválido

Scenario: Atualização de várias informações da conta
Given eu estou logado como "Ouvinte" com nome "Carlos" e senha "Senhasupersecreta1!" e login "Carlos1"
And eu estou na página de "Página inicial”
When eu seleciono "Atualizar conta"
And eu preencho o campo "Nome" com "Roberto"
And eu preencho o campo "Senha" com "Senhasupersecreta2!"
And eu preencho o campo "Tipo de conta" como "Artista"
And eu preencho o campo "Senha atual" com "Senhasupersecreta1!"
And eu seleciono "Confirmar"
Then eu vejo uma mensagem na tela de "Sua conta foi atualizada com sucesso."
And o usuário de login "Carlos1" existe com o nome "Roberto" e senha "Senhasupersecreta2!" e tipo de conta "Artista"

Scenario: Atualização de informação com um valor inválido
Given eu estou logado como "Ouvinte" com nome "Carlos" e senha "Senhasupersecreta1!" e login "Carlos1"
And eu estou na página de "Página inicial"
When eu seleciono "Atualizar conta"
And eu preencho o campo "Senha" com "ab"
And eu preencho o campo "Senha atual" com "Senhasupersecreta1!"
And eu seleciono "Confirmar"
Then eu vejo uma mensagem na tela de "Sua senha deve ter pelo menos 3 caracteres."
And o usuário de login "Carlos1" existe com a senha "Senhasupersecreta1!"
And o campo "Senha" deve estar destacado como inválido

Scenario: Atualização de informação da conta sem preencher valores
Given eu estou logado como "Ouvinte" com nome "Carlos" e senha "Senhasupersecreta1!" e login "Carlos1"
And eu estou na página de "Página inicial"
When eu seleciono "Atualizar conta"
And eu deixo todos os campos de atualização vazios
And eu preencho o campo "Senha atual" com "Senhasupersecreta1!"
And eu seleciono "Confirmar"
Then eu vejo uma mensagem na tela de "Preencha um dos campos de atualização para atualizar a conta."
And o usuário de login "Carlos1" existe com o nome "Carlos" e senha "Senhasupersecreta1!"

Scenario: Remover a conta do serviço de streaming de música
Given eu estou logado como "Ouvinte" com nome "Carlos" e senha "Senhasupersecreta1!" e login "Carlos1"
And eu estou na página de "Página inicial"
When eu seleciono "Remover conta"
And eu preencho o campo "Senha" com "Senhasupersecreta1!"
And eu seleciono "Confirmar"
Then eu vejo uma mensagem na tela de "Sua conta foi removida do sistema com sucesso."
And o usuário de login "Carlos1" não deve mais existir no sistema

Scenario: Erro ao não inserir a senha correta para remover conta
Given eu estou logado como "Ouvinte" com nome "Carlos" e senha "Senhasupersecreta1!" e login "Carlos1"
And eu estou na página de "Página inicial"
When eu seleciono "Remover conta"
And eu preencho o campo "Senha" com "Senha!"
And eu seleciono "Confirmar"
Then eu vejo uma mensagem na tela de "Insira a senha correta para confirmar a remoção."
And o campo "Senha" deve estar destacado como inválido
And o usuário de login "Carlos1" existe com o nome "Carlos" e senha "Senhasupersecreta1!"

Scenario: Usuário cancela a remoção da conta
Given eu estou logado como "Ouvinte" com nome "Carlos" e senha "Senhasupersecreta1!" e login "Carlos1"
And eu estou na página de "Página inicial"
When eu seleciono "Remover conta"
And eu seleciono "Cancelar"
Then eu vou para a "Página inicial"
And o usuário de login "Carlos1" existe com o nome "Carlos" e senha "Senhasupersecreta1!"
