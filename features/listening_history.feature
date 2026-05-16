Feature: Exibir histórico de músicas e podcasts ouvidos
As a usuário
I want to ver meu histórico de músicas e podcasts
So that eu possa rever as músicas e podcasts que eu escutei

Scenario: Visualizar histórico vazio
Given eu estou logado na minha conta
And eu estou na página de "Página inicial"
And não existem itens no meu histórico
When eu clico na opção de "Visualizar histórico"
Then eu devo ver uma mensagem indicando que não há itens no histórico

Scenario: Visualizar histórico unificado
Given eu estou logado na minha conta
And eu estou na página de "Página inicial"
When eu clico na opção de "Visualizar histórico"
Then eu devo ver na tela músicas e podcasts no mesmo histórico
And os itens devem estar ordenados do mais recente para o mais antigo

Scenario Outline: Filtrar histórico por diferentes critérios
Given eu estou logado na minha conta
And existem itens no meu histórico
And eu estou na página inicial
When eu acesso meu histórico de reprodução
And eu filtro o histórico por "<critério>" com valor "<valor>"
Then eu devo ver apenas itens que correspondam ao filtro
And os itens devem estar ordenados do mais recente para o mais antigo

Examples:
| critério |    valor   |
|   tipo   |   músicas  |
|   tipo   |   podcasts |
|  titulo  |   xxxxxxx  |
|   data   | 2026-01-01 |

Scenario: Buscar item existente no histórico
Given eu estou logado na minha conta
And eu estou na página de "Histórico"
And existe um item com título "abcd" no histórico
When eu busco por "abcd" no histórico
Then eu devo ver o item "abcd" nos resultados

Scenario: Buscar item inexistente no histórico
Given eu estou logado na minha conta
And eu estou na página de "Histórico"
And não existe um item com título "abcd" no histórico
When eu busco por "abcd" no histórico
Then eu devo ver uma mensagem na tela dizendo que não há resultados

Scenario: Buscar itens por correspondência parcial retornando múltiplos resultados
Given eu estou logado na minha conta
And eu estou na página de "Histórico"
And existe um item com título "Podcast A" no histórico
And existe um item com título "Podcast B" no histórico
When eu busco por "Podcast" no histórico
Then eu devo ver todos os itens que contenham "Podcast" no título
And não devo ver itens que não correspondam à busca

Scenario: Alternar entre visualização unificada e separada
Given eu estou logado na minha conta
And existem músicas e podcasts no meu histórico
And eu estou na página de "Página inicial"
When eu clico na opção de "Visualizar histórico"
And eu filtro o histórico por "Músicas"
And eu removo o filtro
Then eu devo ver músicas e podcasts no histórico
And os itens devem estar ordenados do mais recente para o mais antigo

Scenario: Registrar um item que foi reproduzido quando não irá ultrapassar o limite
Given eu estou logado na minha conta
And meu histórico não está com o número máximo de itens
When eu reproduzo um item do tipo "Música"
Then o item do tipo "Música" deve ser adicionado ao topo do histórico

Scenario: Registrar um item que foi reproduzido quando o histórico estiver no limite de itens
Given eu estou logado na minha conta
And meu histórico está no número máximo de itens
When eu reproduzo um item do tipo "Podcast"
Then o item mais antigo no meu histórico deve ser removido
And o novo item do tipo "Podcast" deve ser adicionado ao topo do histórico

Scenario: Remover um item do histórico
Given eu estou logado na minha conta
And eu estou na página de "Histórico"
And meu histórico possui pelo menos um item existente
When eu clico em um item
And eu clico em "Remover item do histórico"
Then o item deve ser removido do histórico
And ele não deve mais aparecer na lista de histórico

Scenario: Limpar histórico completo
Given eu estou logado na minha conta
And eu estou na página de "Histórico"
And meu histórico possui pelo menos um item existente
When eu clico na opção de "Limpar histórico"
Then o histórico deve ficar vazio 

Scenario: Manter histórico após logout e login
Given eu estou logado na minha conta
And meu histórico possui pelo menos um item existente
When eu faço logout
And eu faço login após o logout
Then meu histórico deve permanecer o mesmo

