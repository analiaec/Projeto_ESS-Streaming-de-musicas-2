Feature: Recuperação de conta via E-mail/ Esqueci a senha
As a usuário
I want to recuperar minha conta caso eu esquecer a senha
So that eu possa usar a minha conta novamente

Scenario: Solicitar recuperação de conta com e-mail válido
Given eu tenho uma conta cadastrada com o e-mail "abc@gmail.com"
And eu estou na página de "Login"
When eu clico em "Esqueci a senha"
And eu preencho o campo "Email" com "abc@gmail.com"
Then o sistema deve enviar um e-mail com instruções para redefinição de senha
And eu devo ver uma mensagem na tela informando que um e-mail foi enviado para o e-mail informado

Scenario: Solicitar recuperação de conta com e-mail não cadastrado
Given não existe uma conta cadastrada com o e-mail "inexistente@gmail.com"
And eu estou na página de "Login"
When eu clico em "Esqueci a senha"
And eu preencho o campo "Email" com "inexistente@gmail.com"
Then eu devo ver uma mensagem na tela informando que não existe uma conta cadastrada com esse Email
And o campo "Email" deve estar destacado como inválido

Scenario: Redefinir senha com link válido
Given eu recebi um link válido de redefinição
When eu acesso o link de redefinição
And eu preencho o campo "Senha" com "Senhasupersecreta1!"
And eu clico em "Confirmar"
Then eu posso fazer o login utilizando a nova senha

Scenario: Acessar link inválido ou expirado
Given eu recebi um link de redefinição inválido ou expirado
When eu acesso o link de redefinição
Then o sistema deve informar que o link é inválido ou expirado
And eu vejo uma mensagem na tela dizendo para eu tentar receber outro link

Scenario: Link válido porém a senha informada não é válida
Given eu recebi um link válido de redefinição
When eu acesso o link de redefinição
And eu preencho o campo "Senha" com "senha"
And eu clico em "Confirmar"
Then eu vejo uma mensagem na tela dizendo "Insira uma senha válida com pelo menos 8 caracteres."
And o campo "Senha" deve estar destacado como inválido

Scenario: Invalidar link de redefinição de senha após uso
Given eu recebi um link válido de redefinição de senha
When eu utilizo o link de redefinição
Then o link de redefinição deve se tornar inválido

