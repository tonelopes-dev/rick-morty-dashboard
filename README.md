# Dashboard Rick e Morty

Este é um projeto Angular que consome a API pública de Rick e Morty para exibir informações sobre personagens e episódios da série.

## Funcionalidades

- Listagem de personagens com paginação
- Detalhes completos de cada personagem
- Listagem de episódios
- Detalhes de cada episódio com lista de personagens participantes
- Sistema de autenticação básico
- Barra de pesquisa para personagens e episódios

## Tecnologias Utilizadas

- Angular 17
- TypeScript
- SCSS para estilização
- API pública de Rick e Morty

## Como Executar

1. Clone o repositório
2. Instale as dependências: `npm install`
3. Inicie o servidor de desenvolvimento: `npm start`
4. Acesse `http://localhost:4200` no navegador

## Estrutura do Projeto

- `src/app/pages/`: Contém as páginas principais da aplicação
  - `characters-list/`: Listagem de personagens
  - `character-detail/`: Detalhes do personagem
  - `episodes-list/`: Listagem de episódios
  - `episode-detail/`: Detalhes do episódio
  - `login/`: Página de autenticação
  - `profile/`: Perfil do usuário

- `src/app/services/`: Serviços para chamadas à API
  - `rick-morty.service.ts`: Integração com a API de Rick e Morty
  - `auth.service.ts`: Gerenciamento de autenticação
  - `search.service.ts`: Funcionalidade de busca

## Contribuição

Contribuições são bem-vindas! Sinta-se à vontade para abrir issues ou enviar pull requests.
