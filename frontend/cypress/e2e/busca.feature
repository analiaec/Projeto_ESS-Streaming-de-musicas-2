Feature: Busca de músicas

  Scenario: Busca por filtro de gênero retorna resultados
    Given estou na página de busca
    And existe no sistema a música "Oceano" do gênero "MPB"
    And existe no sistema a música "Sina" do gênero "MPB"
    When seleciono o gênero "MPB"
    And clico em buscar
    Then devo ver a música "Oceano" de gênero "MPB" nos resultados
    And devo ver a música "Sina" de gênero "MPB" nos resultados
    And os resultados devem ter no máximo 10 músicas

  Scenario: Busca por filtro de artista retorna resultados
    Given estou na página de busca
    And existe no sistema a música "Conversa de Botequim" do artista "Noel Rosa"
    And existe no sistema a música "Com Que Roupa" do artista "Noel Rosa"
    When digito "Noel Rosa" no campo de artista
    And clico em buscar
    Then devo ver a música "Conversa de Botequim" de gênero "Samba" nos resultados
    And devo ver a música "Com Que Roupa" de gênero "Samba" nos resultados

  Scenario: Busca combinada por nome e filtro de gênero
    Given estou na página de busca
    And existe no sistema a música "Se.." do gênero "MPB"
    When digito "Se.." no campo de busca
    And seleciono o gênero "MPB"
    And clico em buscar
    Then devo ver a música "Se.." de gênero "MPB" nos resultados

  Scenario: Busca por nome que não retorna resultados
    Given estou na página de busca
    And não existe no sistema nenhuma música com nome "MusicaPesada123"
    When digito "MusicaPesada123" no campo de busca
    And clico em buscar
    Then devo ver a mensagem "Nenhum resultado para essa busca"
    And nenhum item deve ser exibido na lista de resultados