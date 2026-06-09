# language: pt

Funcionalidade: Gerenciamento de Podcasts e Episódios
  Como um podcaster cadastrado na plataforma
  Quero gerenciar meus episódios de podcast
  Para que os ouvintes possam acessar e baixar meu conteúdo

  Contexto:
    Dado que existe um podcaster com login "podcaster01" e senha "senha123"
    E que existe um ouvinte com login "ouvinte01"

  # -----------------------------------------------------------------------
  # CRUD de Episódios
  # -----------------------------------------------------------------------

  Cenário: Criar um episódio publicado imediatamente
    Dado que estou autenticado como podcaster "podcaster01"
    Quando eu envio uma requisição POST para "/api/podcast/podcaster01/episodes" com:
      | campo      | valor                            |
      | titulo     | Episódio Piloto                  |
      | arquivoUrl | https://exemplo.com/ep1.mp3      |
    Então a resposta deve ter status 201
    E o episódio deve estar com "publicado" igual a true

  Cenário: Criar um episódio com publicação agendada para o futuro
    Dado que estou autenticado como podcaster "podcaster01"
    Quando eu envio uma requisição POST para "/api/podcast/podcaster01/episodes" com:
      | campo                    | valor                       |
      | titulo                   | Episódio Agendado           |
      | arquivoUrl               | https://exemplo.com/ep2.mp3 |
      | dataPublicacaoAgendada   | 2099-12-31T00:00:00.000Z    |
    Então a resposta deve ter status 201
    E o episódio deve estar com "publicado" igual a false

  Cenário: Episódio agendado não aparece na listagem pública antes da data
    Dado que existe um episódio agendado para "2099-12-31T00:00:00.000Z" no podcast "podcaster01"
    Quando eu faço GET em "/api/podcast/podcaster01/episodes"
    Então o episódio agendado não deve aparecer na lista

  Cenário: Atualizar o título de um episódio
    Dado que existe um episódio de id 1 no podcast "podcaster01"
    E que estou autenticado como podcaster "podcaster01"
    Quando eu envio uma requisição PATCH para "/api/podcast/podcaster01/episodes/1" com:
      | campo  | valor            |
      | titulo | Título Revisado  |
    Então a resposta deve ter status 200
    E o campo "titulo" da resposta deve ser "Título Revisado"

  Cenário: Deletar um episódio
    Dado que existe um episódio de id 2 no podcast "podcaster01"
    E que estou autenticado como podcaster "podcaster01"
    Quando eu envio uma requisição DELETE para "/api/podcast/podcaster01/episodes/2"
    Então a resposta deve ter status 200
    E o episódio de id 2 não deve mais existir no podcast "podcaster01"

  Cenário: Tentativa de editar episódio de outro podcaster é rejeitada
    Dado que existe um episódio de id 3 no podcast "outro_podcast"
    E que estou autenticado como podcaster "podcaster01"
    Quando eu envio uma requisição PATCH para "/api/podcast/podcaster01/episodes/3" com:
      | campo  | valor    |
      | titulo | Invasão  |
    Então a resposta deve ter status 403

  # -----------------------------------------------------------------------
  # Exibir total de acessos
  # -----------------------------------------------------------------------

  Cenário: Registrar acesso ao reproduzir um episódio
    Dado que existe um episódio publicado de id 4 no podcast "podcaster01"
    Quando eu envio uma requisição POST para "/api/podcast/episodes/4/play"
    Então a resposta deve ter status 201
    E o campo "reproducoes" da resposta deve ser maior que 0

  Cenário: Exibir total de acessos do canal
    Dado que o podcast "podcaster01" tem episódios com acessos registrados
    Quando eu faço GET em "/api/podcast/podcaster01/acessos-total"
    Então a resposta deve ter status 200
    E o campo "totalAcessos" deve ser um número inteiro não negativo

  Cenário: Total de acessos de canal sem episódios é zero
    Dado que o podcast "podcaster01" não tem episódios publicados
    Quando eu faço GET em "/api/podcast/podcaster01/acessos-total"
    Então a resposta deve ter status 200
    E o campo "totalAcessos" deve ser 0

  # -----------------------------------------------------------------------
  # Download de episódio
  # -----------------------------------------------------------------------

  Cenário: Ouvinte logado pode baixar um episódio
    Dado que existe um episódio publicado de id 5 com arquivo no podcast "podcaster01"
    Quando eu faço GET em "/api/podcast/episodes/5/download" com header "x-user-login: ouvinte01"
    Então a resposta deve ter status 200
    E o campo "autorizadoParaDownload" deve ser true
    E o campo "arquivoUrl" deve estar presente

  Cenário: Usuário não autenticado não pode baixar episódio
    Dado que existe um episódio publicado de id 5 com arquivo no podcast "podcaster01"
    Quando eu faço GET em "/api/podcast/episodes/5/download" sem header de login
    Então a resposta deve ter status 401

  Cenário: Download com login inexistente é rejeitado
    Dado que existe um episódio publicado de id 5 com arquivo no podcast "podcaster01"
    Quando eu faço GET em "/api/podcast/episodes/5/download" com header "x-user-login: login_fantasma"
    Então a resposta deve ter status 401
