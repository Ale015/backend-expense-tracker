# Expense Tracker (Monitoramento de Fluxo de Caixa Pessoal) (Backend)
> Este é um projeto pessoal de API para controle de despesas e rendas, desenvolvido com Node.js, TypeScript e PostgreSQL. A Aplicação é composta por uma API Conteinerizada juntamente de um Banco de Dados SQL rodando localmente utilizando Docker (DockerFile para a API e Docker-compose para configuração simultânea dos serviços).
> Os benefícios desta API estão na facilidade de implementação local e/ou deploy. Além disso, a API conta com rotas gerais de manipulação CRUD dos dados, além de rotas auxiliares para calcular os totais de cada tipo de transação.

---

## 🚀 Stack Utilizada:

- Node.js
- TypeScript
- PostgreSQL
- Docker
- Express

- Railway (opcional)

## 📍Rotas

### `GET /transactions`
Retorna todas as transações registradas.
#### Parâmetros adicionais:
**startDate**: 
Filtra por transações a partir da data informada.

**endDate**:
Filtra por transações anteriores à data informada.

**orderBy**:
Ordena as transações baseadas na data informada.

    `ASC` -> Crescente (Mais antiga para a mais nova)
    `DESC` -> Decrescente (Mais atual para mais antigo)

### `POST /transactions`
Salva uma transação nova no banco de dados.
#### Estrutura do body (JSON)
```
    {
        "title": "string"
        "amount": 1000.00
        "type": 'expense' || 'income'
        "date": `YYYY-MM-DD`
    }
```

### `GET /transactions/id`
Retorna a transação referente ao Id passado na rota.
Basta indicar o ID correspondente na URL.

### `PUT /transactions/id`
Atualiza todos os atributos de uma transação **já existente**.

ID: Passado no corpo da URL.

```
    {
        "title": "string"
        "amount": 1000.00
        "type": 'expense' || 'income'
        "date": `YYYY-MM-DD`
    }
```

### `DELETE /transactions/id`
Realiza a exclusão de uma transação armazenada.
ID passado no corpo da URL.


### `GET /dashboard`
Irá retornar os valores referentes ao Total calculado (Rendas - Despesas)

#### Estrutura da Resposta *(JSON)*
```
{
    "total": 0,
    "totalIncomes": 0,
    "totalExpenses": 0
}
```
#### Parâmetros adicionais:
**startDate**: 
Filtra por transações a partir da data informada.

**endDate**:
Filtra por transações anteriores à data informada.

## 🌲 Estrutura do Projeto
```
/expense-tracker-api 
│   
│   docker-compose.yml      #   Orquestra dos containers (API e Banco de Dados)
│   dockerfile              #   Imagem da API para conteinerização
│
├───dist    # Código compilado em JavaScript para ambiente de produção
│
└───src
    │   app.ts      
    │   server.ts    # Setup do Express, uso do JSON e rota base 
    │
    ├───config
    │       database.ts     # Connection Pool com o PostgreSQL
    │
    ├───migrations
    │       migrations.ts      # Script de criação da tabela caso ainda não gerado
    │
    ├───models
    │       transactionModel.ts     # Funções de manipulação das transações  
    │
    └─── routes
            routes.ts       # Rotas RESTful de Interação 

```

## ⚙️ Como Rodar

### Requisitos Gerais
- Node.js
- Docker e Docker Compose

### Cenário 1: Uso Local

1. Clonar o Projeto para seu repositório local

    `git clone <url-do-repositório>`

2. Instalar as Dependências

    `npm install`

3. Criar arquivo **.env** (variáveis de ambiente)

> Neste arquivo deve conter:

```
PORT= Porta da API exposta
DATABASE_URL=postgres://<usuário>:<senha>@<container Banco de Dados>:<Porta Banco de Dados>/<nome do banco de dados>

PG_USER= Usuário
PG_PASSWORD= Senha
PG_DATABASE=Nome do Banco de Dados
PG_HOST= Nome do Container que roda o Banco de Dados
PG_PORT= Porta exposta do Banco de dados

```
4. Executar os containers da aplicação

`docker-compose up -d`
> -d = flag opcional para rodar em background e desocupar o terminal.

5. Testar com **DBeaver** e **Postman**

*ex.:*
`http://localhost:3000/api/transactions`

---

### Cenário 2: Deploy em Servidor

1. Clonar o Projeto para seu repositório local

    `git clone <url-do-repositório>`

2. Instalar as Dependências

    `npm install`

3. Criar arquivo **.env** (variáveis de ambiente)

> Neste arquivo deve conter:

```
PORT= Porta da API exposta
DATABASE_URL=postgres://<usuário>:<senha>@<container Banco de Dados>:<Porta Banco de Dados>/<nome do banco de dados>

PG_USER= Usuário
PG_PASSWORD= Senha
PG_DATABASE=Nome do Banco de Dados
PG_HOST= Nome do Container que roda o Banco de Dados
PG_PORT= Porta exposta do Banco de dados

```
4. Alterar o Docker Compose do projeto.
> Em serviços onde o banco de dados é montado em externo à API, é necessário retirar a dependência da API em relação ao banco de dados conteinerizado, para isso, seu arquivo docker-compose.yml deve retirar o módulo `depends_on: db` e se for de sua preferência retirar também o serviço `db` por completo do arquivo:

```
services:
  api:
    build:
      context: .
      dockerfile: dockerfile
    container_name: expense_tracker_api_container
    restart: always
    environment:
      DATABASE_URL: ${DATABASE_URL}
    ports:
      - "${PORT}:${PORT}"
volumes:
  pgdata:
```

5. Abrir Repositório no Servidor de Hospedagem (Exemplo Railway) e adicionar a `connection_url` fornecida pelo banco de dados externo.
> -d = flag opcional para rodar em background e desocupar o terminal.

5. Testar com **Postman**.

---

## Principais Comandos

`npm install`: Instala dependências

`npm run dev`: Inicia a API em modo desenvolvimento

`docker-compose up -d`:	Sobe os containers da API e do banco

`npm run build`: Compila TypeScript para produção

`npm run start-prod`: Roda a API já compilada
