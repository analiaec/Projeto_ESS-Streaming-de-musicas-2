Feature: Streaming System

  Scenario: Exibicao da pagina inicial para usuario logado
    Given estou logado como "Usuário" com login "LuisCardoso012" e senha "1234"
    When acesso a página inicial
    Then posso ver o campo de busca
    And posso ver a seção "Músicas em Alta"
    And posso ver a seção "Podcasts em Alta"
    And posso ver meu histórico de músicas ouvidas recentemente
    And posso ver minhas playlists
    And posso ver um ícone
    And vejo uma mensagem na parte de cima da tela: "Ola, LuisCardoso012!"

  Scenario: Exibicao da pagina inicial para usuario nao logado
    Given não estou logado na plataforma
    When acesso a página inicial
    Then posso ver o campo de busca
    And posso ver a seção "Músicas em Alta"
    And posso ver a seção "Podcasts em Alta"
    And não posso ver meu histórico de músicas ouvidas recentemente
    And não posso ver minhas playlists
    And vejo uma mensagem na parte de cima da tela: "Faça login"

  Scenario: Busca que nao retorna resultados
    Given estou logado como "Usuário" com login "LuisCardoso012" e senha "1234"
    And estou na página de busca
    And não existe nenhum item no sistema que tenha título "MusicaPesada123" ou semelhante
    When realizo uma busca pelo termo "MusicaPesada123"
    Then o sistema deve exibir um placeholder informando que nenhum resultado foi encontrado
    And nenhum conteúdo deve ser listado
    And eu continuo na página de busca

  Scenario: Busca com filtro de genero inexistente
    Given estou na página de busca
    When pesquiso pelo termo ""
    And aplico o filtro de gênero "GeneroInexistente123"
    Then devo ver um placeholder informando que não houveram resultados
    And o sistema não deve exibir nenhum item na lista de resultados

  Scenario: Busca por nome que retorna resultado
    Given estou logado como "Usuário" com login "LuisCardoso012" e senha "1234"
    And estou na página "Busca"
    And existe um item com título "MusicaBonita123"
    When realizo uma busca pelo termo "MusicaBonita123"
    Then o sistema deve exibir a música "MusicaBonita123" nos resultados
    And os resultados devem estar ordenados de forma decrescente priorizando correlações exatas e depois parciais
    And músicas com mesma correlação devem ser ordenadas pelo total de reproduções
    And nenhuma música sem correlação com "MusicaBonita123" deve ser exibida

  Scenario: Busca por musicas utilizando filtro de ano de lancamento com resultados
    Given estou logado como "Usuário" com login "LuisCardoso012" e senha "1234"
    And existe no sistema músicas do ano "1994"
    And estou na página de busca
    When realizo uma busca pelo termo ""
    And aplico o filtro de ano de lançamento "1994"
    Then o sistema deve exibir as 10 músicas com maior número de reproduções do ano "1994"
    And os resultados devem estar ordenados de forma decrescente pelo total de reproduções
    And nenhuma música com ano de lançamento diferente de "1994" deve ser exibidaZ

  Scenario: Exibicao do historico de filtros ao abrir a busca
    Given estou logado como "Usuário" com login "LuisCardoso012" e senha "1234"
    And o sistema possui os filtros "MPB", "Djavan" armazenados como filtros utilizados na última busca feita pela conta
    When acesso a tela de busca sem realizar mais nenhuma ação
    Then o sistema deve exibir os filtros "MPB", "Djavan" como últimos filtros aplicados

  Scenario: Busca por musicas utilizando filtro de genero com resultados
    Given estou logado como "Usuário" com login "LuisCardoso012" e senha "1234"
    And existe no sistema músicas do gênero "MPB"
    And estou na página "Busca"
    When pesquiso pelo termo ""
    And aplico o filtro de gênero "MPB"
    Then o sistema deve exibir as 10 músicas com maior número de reproduções do gênero "MPB" nos resultados
    And os resultados devem estar ordenados de forma decrescente pelo total de reproduções
    And nenhuma música de gênero diferente de "MPB" deve ser listada

  Scenario: Busca por musicas utilizando filtro de nome do artista
    Given estou logado como "Usuário" com login "LuisCardoso012" e senha "1234"
    And existe no sistema músicas do artista "Noel Rosa"
    And estou na página "Busca"
    When pesquiso pelo termo ""
    And aplico o filtro de nome de artista "Noel Rosa"
    Then o sistema deve exibir as 10 músicas com maior número de reproduções associadas ao artista "Noel Rosa" nos resultados
    And os resultados devem estar ordenados de forma decrescente pelo total de reproduções
    And nenhuma música associada à um outro nome de artista deve ser listada

  Scenario: Busca por musica utilizando filtro de genero e campo de nome com resultados
    Given estou logado como "Usuário" com login "LuisCardoso012" e senha "1234"
    And existe no sistema a música "Se.." do gênero "MPB"
    And estou na página de busca
    When pesquiso pelo termo "Se.."
    And aplico o filtro de gênero "MPB"
    Then o sistema deve exibir a música "Se.." nos resultados
    And os resultados devem estar ordenados de forma decrescente pelo total de reproduções
    And nenhuma música de gênero diferente de "MPB" deve ser listada

  Scenario: Empate em numero de reproducoes no ranking Em Alta
    Given que a música "Eu te devoro" está cadastrada no sistema, está no ranking Em Alta e possui 980 reproduções
    And que a música "Se.." está cadastrada no sistema, está no ranking Em Alta e possui 980 reproduções
    When o sistema ordena o ranking músicas Em Alta
    Then as músicas devem ser ordenadas de maneira alfabética por critério de desempate

  Scenario: Ultrapassagem de numero de reproducoes no ranking Em Alta
    Given que a música "Oceano" está cadastrada no sistema, está no ranking Em Alta e possui 1000 reproduções
    And que a música "Sina" está cadastrada no sistema, está no ranking Em Alta e possui 999 reproduções
    And o ranking de músicas em alta exibe "Oceano" na posição 1
    And o ranking de músicas em alta exibe "Sina" na posição 2
    When a música "Sina" recebe 2 novas reproduções
    Then o total de reproduções da música "Sina" deve ser 1001
    And o ranking de músicas em alta exibe "Sina" na posição 1
    And o ranking de músicas em alta exibe "Oceano" na posição 2

  Scenario: Exibicao da pagina de busca
    Given estou logado como "Usuário" com login "LuisCardoso012" e senha "1234"
    And estou na página inicial da aplicação
    When seleciono a seção de busca
    Then posso ver o campo de busca por nome da música
    And posso ver o campo de filtro "gênero"
    And posso ver o campo de filtro "Nome do artista/podcast"
    And posso ver o campo de filtro "Ano de lançamento"


  #Scenario: Busca sem diferenciar Caixa alta e baixa
  #  Given que a música "Oceano" está cadastrada no sistema
  #  When uma busca com filtros é realizada com o termo "oceano"
  #  Then a música "Oceano" deve ser retornada pelo sistema

  #Scenario: Recomendacao de musicas com base em um unico genero
  #  Given estou logado como "Usuario" com login "LuisCardoso012" e senha "1234"
  #  And meu histórico de reproduções contém apenas as músicas "Chega de Saudade" e "Desafinado" do gênero "Bossa Nova"
  #  And existem músicas do gênero "Bossa Nova" armazenadas no sistema que não estão presentes no meu histórico
  #  And eu estou na página inicial
  #  When eu acesso a seção de músicas recomendadas
  #  Then o sistema deve exibir músicas do gênero "Bossa Nova" nas recomendações
  #  And músicas de outros gêneros não devem ser recomendadas
  #  And músicas "Chega de Saudade" e "Desafinado" não devem ser recomendadas