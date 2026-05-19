Funcionalidade: Gerenciamento de Álbuns e Músicas
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
    
