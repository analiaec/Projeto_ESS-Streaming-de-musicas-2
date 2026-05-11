Feature: Calcular podcasts, artistas e músicas mais escutados no mês
As a usuario
I want to saber quais os podcasts, artistas e músicas que eu mais escutei no mês
So that eu possa conhecer melhor sobre meus gostos musicais

Scenario: Cálculo do ranking de uma categoria com base nas reproduções acumuladas no mês anterior
Given a data registrada no sistema é o primeiro dia do mês atual
And o ranking mensal da categoria "Música" não foi calculado
And existem reproduções de itens da categoria "Música" registradas no mês anterior
When o sistema calcula o ranking mensal da categoria "Música"
Then o sistema deve considerar todas as reproduções de itens da categoria "Música" até o último dia do mês anterior
And o sistema deve armazenar o ranking que deve listar os itens do tipo "Música" ordenados por quantidade de reproduções decrescente

Scenario Outline: Acessar os itens mais escutados no mês de cada categoria
Given eu estou logado como "Ouvinte" com nome "Carlos" e senha "Senhasupersecreta1!" e login "Carlos1"
And o sistema calculou o ranking mensal
And eu estou na página de "Página inicial"
When eu seleciono "Ranking mensal"
And eu acesso o ranking mensal de itens do tipo "<categoria>"
Then eu vejo os itens do tipo "<categoria>" ordenados por quantidade de reproduções decrescente

Examples:
| categoria |
|  musicas  |
|  artistas |
|  podcasts |
|   gênero  |

Scenario: Retornar apenas o top 10 itens mais escutados de uma categoria
Given existem mais de 10 itens do tipo "Música" do mês atual
And eu estou logado na minha conta
And eu estou na página de "Página inicial"
When o sistema calcula o ranking mensal
And eu clico em "Visualizar top 10"
Then o sistema deve retornar apenas os 10 itens do tipo "Música" mais escutados 
And os itens devem estar ordenados por quantidade de reproduções decrescente

Scenario: Desempate por data da última reprodução
Given dois ou mais itens possuem a mesma quantidade de reproduções no mês atual
When o sistema calcula o ranking mensal
Then o sistema deve usar um critério de desempate por data da última reprodução
And o item com a reprodução mais recente deve aparecer primeiro.

Scenario: Nenhum item de uma categoria reproduzido no mês
Given não existem reproduções de um item do tipo "Podcast" no mês atual
And eu estou logado na minha conta
And eu estou na página de "Página inicial"
When o sistema calcula o ranking mensal
And eu clico em "Visualizar ranking mensal"
Then o sistema deve retornar uma lista vazia para itens do tipo "Podcast"

Scenario: Contabilizar reprodução de item
Given o item "Música A" possui 2 reproduções no mês atual
And eu estou logado na minha conta
When eu reproduzo o item "Música A"
Then o item "Música A" deve passar a ter 3 reproduções no mês atual

Scenario: Manter ranking de um mês disponível durante o próximo mês
Given o ranking do mês de março foi calculado
And o mês atual é abril
And eu estou logado na minha conta
And eu estou na página "Página inicial"
When eu clico em "Visualizar ranking mensal"
Then o ranking mensal que deve aparecer é o ranking calculado em março

Scenario: Substituir ranking ao calcular novo ranking
Given o ranking de março está armazenado
When o ranking de abril é calculado
Then o ranking de março deve ser substituído pelo ranking de abril
And o ranking de março não deve estar disponível

Scenario: Tentar visualizar o ranking quando não há ranking mensal armazenado
Given eu estou logado na minha conta
And eu estou na página de "Página inicial"
And não há ranking mensal calculado
When eu clico em "Visualizar ranking mensal"
Then eu devo ver uma mensagem na tela informando que o ranking mensal ainda não foi calculado

