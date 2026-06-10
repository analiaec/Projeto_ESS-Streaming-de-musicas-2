Feature: Página Inicial

  Scenario: Exibição da página inicial para usuário não logado
    Given estou na página inicial
    And não estou logado na plataforma
    Then devo ver a mensagem "Bem-vindo ao .WAVe"
    And devo ver o botão "Entrar"
    And devo ver o card "Em Alta"
    And devo ver o botão "Criar conta"
    And devo ver o card "Buscar"
    And devo ver o card "Podcasts"
    And não devo ver a seção "Sua biblioteca"

  Scenario: Exibição completa da página inicial para usuário logado
    Given estou logado como "ouvinte" com login "LuisCardoso012" e senha "1234"
    And estou na página inicial
    Then devo ver a saudação "Olá, LuisCardoso012"
    And devo ver a seção "Explorar"
    And devo ver o card "Em Alta"
    And devo ver o card "Buscar"
    And devo ver o card "Podcasts"
    And devo ver a seção "Sua biblioteca"
    And devo ver o card "Para Você"
    And devo ver o card "Playlists"
    And devo ver o card "Histórico"
    And devo ver o card "Minha Conta"
    And não devo ver o botão "Criar conta"
    And não devo ver o botão "Entrar"