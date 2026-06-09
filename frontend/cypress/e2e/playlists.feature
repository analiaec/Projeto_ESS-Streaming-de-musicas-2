Feature: Gerenciamento de Playlists

  Background:
    Given estou logado como "ouvinte" com login "LuisCardoso012"
    And o usuário está na página "playlists"

  Scenario: Criar uma nova playlist pública com sucesso
    When o usuário seleciona a opção "Criar Playlist"
    And o usuário preenche o nome com "Músicas de rock 2026", a descrição com "Minhas favoritas", a visibilidade como "Pública"
    Then o usuário consegue ver a playlist com o nome "Músicas de rock 2026"
    And eu vejo a playlist "Músicas de rock 2026" como "Pública"

  Scenario: Criar uma playlist privada com sucesso
    When o usuário seleciona a opção "Criar Playlist"
    And o usuário preenche o nome com "Playlist privada 2026", a descrição com "Só para mim", a visibilidade como "Privada"
    Then o usuário consegue ver a playlist com o nome "Playlist privada 2026"
    And eu vejo a playlist "Playlist privada 2026" como "Privada"

  Scenario: Editar o nome de uma playlist existente
    Given a playlist "Músicas de rock 2026" já existe
    When o usuário seleciona os três pontos ao lado do nome "Músicas de rock 2026"
    And o usuário muda o nome para "Músicas de rock 2026 Atualizada"
    Then a playlist "Músicas de rock 2026 Atualizada" deve ser renomeada para "Músicas de rock 2026 Atualizada"
    And a playlist "Músicas de rock 2026" não deve aparecer na lista

  Scenario: Excluir uma playlist existente
    Given a playlist "Playlist temporária 2026" já existe
    When o usuário seleciona o botão "Excluir" da playlist "Playlist temporária 2026"
    Then a playlist "Playlist temporária 2026" não deve aparecer na lista

  Scenario: Cancelar a exclusão de uma playlist mantém a playlist na lista
    Given a playlist "Músicas de rock 2026" já existe
    When o usuário cancela a exclusão da playlist "Músicas de rock 2026"
    Then a playlist "Músicas de rock 2026" deve permanecer na lista

  Scenario: Não exibir botões de edição em playlist de outro usuário
    Given existe uma playlist de outro usuário chamada "Playlist de outro usuário"
    Then eu não vejo os botões "Editar" e "Excluir" na playlist "Playlist de outro usuário"
