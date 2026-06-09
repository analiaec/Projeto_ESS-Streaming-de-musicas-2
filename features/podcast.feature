Feature: Gerenciamento de Podcasts e Episódios

  Scenario: Criar um episódio publicado imediatamente
    Given estou logado como "podcaster" com login "techcast"
    When o usuário cria um episódio com título "Novo Episódio Tech" e arquivo "https://exemplo.com/novo.mp3"
    Then o episódio "Novo Episódio Tech" deve aparecer na lista de episódios
    And o episódio "Novo Episódio Tech" deve estar publicado

  Scenario: Criar um episódio com publicação agendada para o futuro
    Given estou logado como "podcaster" com login "techcast"
    When o usuário cria um episódio com título "Episódio Futuro" e arquivo "https://exemplo.com/futuro.mp3" agendado para "2099-12-31"
    Then o episódio "Episódio Futuro" não deve aparecer na listagem pública

  Scenario: Episódio agendado não aparece na listagem pública antes da data
    Given estou logado como "podcaster" com login "techcast"
    And existe o episódio "Ep. 4 — Ecossistema Ruby e programação em par" agendado para "2026-12-31" no podcast "techcast"
    When o usuário acessa a lista de episódios do podcast "techcast"
    Then o episódio "Ep. 4 — Ecossistema Ruby e programação em par" não deve aparecer na listagem pública

  Scenario: Atualizar o título de um episódio
    Given estou logado como "podcaster" com login "techcast"
    And existe o episódio "Ep. 1 — Saas e Cloud potencializam o Agile" no podcast "techcast"
    When o usuário edita o título do episódio "Ep. 1 — Saas e Cloud potencializam o Agile" para "Ep. 1 — SaaS e Cloud (Revisado)"
    Then o episódio deve aparecer com o título "Ep. 1 — SaaS e Cloud (Revisado)"

  Scenario: Deletar um episódio
    Given estou logado como "podcaster" com login "techcast"
    And existe o episódio "Ep. 3 — De Monólitos a Microsserviços com APIs REST" no podcast "techcast"
    When o usuário exclui o episódio "Ep. 3 — De Monólitos a Microsserviços com APIs REST"
    Then o episódio "Ep. 3 — De Monólitos a Microsserviços com APIs REST" não deve aparecer na lista de episódios

  Scenario: Registrar acesso ao reproduzir um episódio
    Given existe o episódio publicado "Ep. 2 — Como o Rails estrutura aplicativos web" no podcast "techcast"
    When o usuário reproduz o episódio "Ep. 2 — Como o Rails estrutura aplicativos web"
    Then o número de reproduções do episódio deve ser maior que zero

  Scenario: Exibir total de acessos do canal
    Given existe o episódio publicado "Ep. 2 — Como o Rails estrutura aplicativos web" no podcast "techcast"
    And o episódio "Ep. 2 — Como o Rails estrutura aplicativos web" foi reproduzido ao menos uma vez
    When o usuário acessa o total de acessos do podcast "techcast"
    Then o total de acessos deve ser um número inteiro não negativo

  Scenario: Total de acessos de canal sem episódios é zero
    Given o podcast "podteste1" não tem episódios publicados
    When o usuário acessa o total de acessos do podcast "podteste1"
    Then o total de acessos deve ser 0

  Scenario: Ouvinte logado pode baixar um episódio
    Given estou logado como "ouvinte" com login "LuisCardoso012"
    And existe o episódio publicado "Ep. 1 — Saas e Cloud potencializam o Agile" com arquivo no podcast "techcast"
    When o usuário faz o download do episódio "Ep. 1 — Saas e Cloud potencializam o Agile"
    Then o download deve ser autorizado
    And o link do arquivo deve estar disponível

  Scenario: Usuário não autenticado não pode baixar episódio
    Given existe o episódio publicado "Ep. 1 — Saas e Cloud potencializam o Agile" com arquivo no podcast "techcast"
    When um usuário não autenticado tenta fazer o download do episódio "Ep. 1 — Saas e Cloud potencializam o Agile"
    Then o usuário recebe uma mensagem de erro de autenticação

