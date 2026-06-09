Feature: Gerenciamento de Podcasts e Episódios

  Scenario: Criar um episódio publicado imediatamente
    Given estou logado como "podcaster" com login "techcast"
    And o usuário está na página "meu-podcast"
    When o usuário preenche o título com "Episódio Cypress Test" e o arquivo com "https://exemplo.com/ep.mp3"
    And o usuário clica em "Criar Episódio"
    Then o episódio "Episódio Cypress Test" deve aparecer na lista
    And o episódio "Episódio Cypress Test" deve estar marcado como "Publicado"

  Scenario: Criar um episódio com publicação agendada para o futuro
    Given estou logado como "podcaster" com login "techcast"
    And o usuário está na página "meu-podcast"
    When o usuário preenche o título com "Episódio Agendado Cypress" e o arquivo com "https://exemplo.com/ep2.mp3" e agenda para "2099-12-31T10:00"
    And o usuário clica em "Criar Episódio"
    Then o episódio "Episódio Agendado Cypress" deve aparecer na lista
    And o episódio "Episódio Agendado Cypress" deve estar marcado como "Agendado"

  Scenario: Episódio agendado não aparece na listagem pública antes da data
    Given o usuário está na página pública do podcast "techcast"
    Then o episódio "Ep. 4 — Ecossistema Ruby e programação em par" não deve aparecer na lista pública

  Scenario: Atualizar o título de um episódio
    Given estou logado como "podcaster" com login "techcast"
    And o usuário está na página "meu-podcast"
    And existe um episódio chamado "Episódio Para Editar" no podcast "techcast"
    When o usuário edita o episódio "Episódio Para Editar" com o novo título "Episódio Editado com Sucesso"
    Then o episódio "Episódio Editado com Sucesso" deve aparecer na lista

  Scenario: Deletar um episódio
    Given estou logado como "podcaster" com login "techcast"
    And o usuário está na página "meu-podcast"
    And existe um episódio chamado "Episódio Para Deletar" no podcast "techcast"
    When o usuário deleta o episódio "Episódio Para Deletar"
    Then o episódio "Episódio Para Deletar" não deve aparecer na lista

  Scenario: Reproduzir um episódio incrementa o contador
    Given o usuário está na página pública do podcast "techcast"
    When o usuário clica em reproduzir o episódio "Ep. 1 — Saas e Cloud potencializam o Agile"
    Then o contador de reproduções do episódio aumenta em 1

  Scenario: Exibir o total de acessos do canal
    Given o usuário está na página pública do podcast "techcast"
    Then o total de reproduções do canal deve ser exibido

  Scenario: Total de acessos do canal sem reproduções é zero
    Given o usuário está na página pública do podcast "podteste1"
    Then o total de acessos exibido deve ser 0

  Scenario: Ouvinte logado vê o botão de download
    Given estou logado como "ouvinte" com login "LuisCardoso012"
    And o usuário está na página pública do podcast "techcast"
    Then o botão de download está disponível para o episódio "Ep. 1 — Saas e Cloud potencializam o Agile"

  Scenario: Usuário não autenticado vê link de login para download
    Given o usuário está na página pública do podcast "techcast"
    Then o episódio "Ep. 1 — Saas e Cloud potencializam o Agile" exibe o link "Login p/ download"
