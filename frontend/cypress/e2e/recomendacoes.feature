Feature: Recomendações com base no histórico

  Scenario: Recomendacao de musicas com base em genero
    Given estou logado como "Usuario" com login "LuisCardoso012" e senha "1234"
    And meu histórico de reproduções contém apenas músicas dos gêneros "MPB" e "Bossa Nova"
    And existem músicas do gênero "Bossa Nova" armazenadas no sistema que não estão presentes no meu histórico
    And existem músicas do gênero "MPB" armazenadas no sistema que não estão presentes no meu histórico
    And meu histórico de reproduções contém 10 ou mais reproduções do gênero "Bossa Nova"
    And meu histórico de reproduções contém 10 ou mais reproduções do gênero "MPB"
    And eu estou na página inicial
    When eu acesso a seção de músicas recomendadas
    Then o sistema deve exibir músicas do gênero "Bossa Nova" nas recomendações
    And o sistema deve exibir músicas do gênero "MPB" nas recomendações
    And músicas de outros gêneros não devem ser recomendadas
    And nenhuma música presente no meu histórico deve ser recomendada

  Scenario: Usuário com quantidade insuficiente de reproduções para recomendação
    Given estou logado como "Usuario" com login "LuisCardoso012" e senha "1234"
    And meu histórico de reproduções contém menos de 10 reproduções
    And eu estou na página inicial
    When eu acesso a seção de músicas recomendadas
    Then nenhuma música deve ser recomendada 
    And deve aparecer a mensagem "Nenhuma recomendação disponível ainda. Comece a ouvir músicas!" na tela

  Scenario: Usuário não logado não acessa recomendações pela página inicial
    Given estou na página inicial
    And não estou logado na plataforma
    Then o card "Para Você" não deve ser exibido na página inicial