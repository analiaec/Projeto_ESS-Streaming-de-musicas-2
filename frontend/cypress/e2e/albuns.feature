Feature: Gerenciamento de Álbuns e Músicas
  Como um artista da plataforma
  Eu quero gerenciar as informações dos meus álbuns lançados
  Para manter o catálogo atualizado sem comprometer a integridade das faixas

  Scenario: Edição de informações válidas de um álbum existente com sucesso
    Given estou logado como "Artista" com login "Vivaldi"
    And existe um álbum chamado "Four Seasons" publicado por "Vivaldi" com ID "4" e gênero "Clássico"
    And as músicas do álbum de ID "4" são "Spring" de índice "1" e "Winter" de índice "2"
    When tento alterar o nome do álbum de ID "4" para "Le quattro stagioni" e o gênero para "Barroco"
    Then existe um álbum chamado "Le quattro stagioni" publicado por "Vivaldi" com ID "4" e gênero "Barroco"
    And as músicas do álbum de ID "4" são "Spring" de índice "1" e "Winter" de índice "2"

  Scenario: Cadastro de álbum com músicas com sucesso
    Given estou logado como "Artista" com login "Vivaldi"
    When tento publicar um álbum chamado "Four Seasons" de ID "1", com gênero "Barroco", data de lançamento "1725-01-01", 
          contendo as músicas "Winter" com arquivo "winter.mp3" e "Summer" com arquivo "summer.mp3"
    Then o álbum "Four Seasons" contendo as músicas "Winter" e "Summer" deve ser indexado na plataforma
    And eu vejo uma mensagem de sucesso "Álbum publicado com sucesso!"
    And existe um álbum chamado "Four Seasons" publicado por "Vivaldi" com ID "1" e gênero "Barroco"
    And as músicas do álbum de ID "1" são "Winter" de índice "1" e "Summer" de índice "2"
