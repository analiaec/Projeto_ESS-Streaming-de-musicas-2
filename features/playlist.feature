Feature: Playlists
  As a usuário
  I want to criar playlists personalizada com minhas músicas escolhidas
  So that eu possa escutar as músicas desejadas naquela playlists

  Scenario: Criar uma playlist com sucesso
    Given estou logado como "Usuário" com login "LuisCardoso012"
    And o usuário está na página "Playlists"
    When o usuário seleciona a opção "Criar Playlist"
    And o usuário preenche o nome com "Músicas de rock 2026", a descrição com "Melhores musicas" , a visibilidade como "Pública"
    Then o usuário consegue ver a playlist com o nome "Músicas de rock 2026"
    And eu vejo uma mensagem de sucesso"playlist criada com sucesso"
    
    Scenario: Falha ao tentar criar uma playlist pois o nome não foi dito
    Given estou logado como "Usuário" com login "LuisCardoso012"
    And o usuário está na página "Playlists"
    When o usuário seleciona a opção "Criar Playlist"
    And o usuário preenche o nome com "", a descrição com "Melhores musicas", a visibilidade como "Pública"
    Then o usuário ainda está na página "Playlists"
    And eu vejo uma mensagem de erro"Por favor preencha o campo do nome"

  Scenario: Falha ao tentar criar uma playlist pois o nome já existe
    Given estou logado como "Usuário" com login "LuisCardoso012"
    And o usuário está na página "Playlists"
    And a playlist "Músicas de rock 2026" já existe
    When o usuário seleciona a opção "Criar Playlist"
    And o usuário preenche o nome com "Músicas de rock 2026", a descrição com "Melhores musicas", a visibilidade como "Pública"
    Then o usuário ainda está na página "Playlists"
    And eu vejo uma mensagem de erro"Essa playlist já existe, escolha um novo nome"

  Scenario: Atualizando uma playlist com sucesso
    Given estou logado como "Usuário" com login "LuisCardoso012"
    And o usuário está na página "Playlists"
    And existe uma playlist chamada "Músicas de rock 2026"
    When o usuário seleciona os três pontos ao lado do nome "Músicas de rock 2026"
    And o usuário seleciona a opção "Atualizar"
    And o usuário muda o nome para "Músicas de rock 2026 Atualizada"
    Then o usuário consegue ver a playlist com o nome "Músicas de rock 2026 Atualizada"
    And eu vejo uma mensagem de sucesso"playlist atualizada com sucesso"
