# Frotas API

Backend do módulo de Gestão de Frota — Teste Técnico Aivacol.

## Tecnologias

| Tecnologia | Uso |
|------------|-----|
| Node.js 24 | Runtime |
| NestJS 10 | Framework |
| TypeORM | ORM com migrations versionadas |
| SQL Server 2022 | Banco de dados relacional |
| Redis | Cache de consultas de veículos |
| JWT + Passport | Autenticação stateless |
| Jest | Testes unitários e de integração |
| Swagger | Documentação interativa |

## Como rodar

### Pré-requisitos

- [Node.js 18+](https://nodejs.org)
- [Docker](https://www.docker.com)

### Passos

```bash
# 1. Instale as dependências
npm install

# 2. Crie o arquivo de variáveis de ambiente
cp .env.example .env

# 3. Suba o SQL Server e o Redis
docker compose up -d

# 4. Inicie a aplicação
npm run start:dev

# 5. Para rodar os testes
npm run test
```

Na primeira execução, o app cria o banco, executa as migrations e popula o seed automaticamente.

API disponível em `http://localhost:3000`
Swagger em `http://localhost:3000/docs`

## Credenciais do seed

| Campo    | Valor          |
|----------|----------------|
| username | `aivacol`      |
| password | `aivacol@2024` |


## Endpoints

Todas as rotas exigem `Authorization: Bearer <token>`, exceto `POST /auth/login`.

### Autenticação

| Método | Rota          | Descrição                  |
|--------|---------------|----------------------------|
| POST   | `/auth/login` | Retorna JWT `access_token` |

**Exemplo:**
```bash
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username": "aivacol", "password": "aivacol@2024"}'
```

### Marcas (`/brands`)

| Método | Rota          | Descrição       |
|--------|---------------|-----------------|
| POST   | `/brands`     | Criar marca     |
| GET    | `/brands`     | Listar marcas   |
| GET    | `/brands/:id` | Buscar por ID   |
| PATCH  | `/brands/:id` | Atualizar marca |
| DELETE | `/brands/:id` | Remover marca   |

### Modelos (`/models`)

| Método | Rota          | Descrição        |
|--------|---------------|------------------|
| POST   | `/models`     | Criar modelo     |
| GET    | `/models`     | Listar modelos   |
| GET    | `/models/:id` | Buscar por ID    |
| PATCH  | `/models/:id` | Atualizar modelo |
| DELETE | `/models/:id` | Remover modelo   |

### Veículos (`/vehicles`)

Cache Redis aplicado em `GET /vehicles` e `GET /vehicles/:id`. Invalidado automaticamente em criações, atualizações e remoções.

| Método | Rota            | Descrição                         |
|--------|-----------------|-----------------------------------|
| POST   | `/vehicles`     | Registrar veículo                 |
| GET    | `/vehicles`     | Listar veículos (cache)           |
| GET    | `/vehicles/:id` | Buscar por ID (cache)             |
| PATCH  | `/vehicles/:id` | Atualizar veículo                 |
| DELETE | `/vehicles/:id` | Remover veículo                   |

### Usuários (`/users`)

| Método | Rota         | Descrição         |
|--------|--------------|-------------------|
| POST   | `/users`     | Criar usuário     |
| GET    | `/users`     | Listar usuários   |
| GET    | `/users/:id` | Buscar por ID     |
| PATCH  | `/users/:id` | Atualizar usuário |
| DELETE | `/users/:id` | Remover usuário   |

## Variáveis de ambiente

Todas as variáveis estão documentadas em `.env.example`.

| Variável             | Padrão            | Descrição                    |
|----------------------|-------------------|------------------------------|
| `PORT`               | `3000`            | Porta da API                 |
| `NODE_ENV`           | `development`     | Ambiente                     |
| `DB_HOST`            | `localhost`       | Host do SQL Server           |
| `DB_PORT`            | `1433`            | Porta do SQL Server          |
| `DB_USERNAME`        | `sa`              | Usuário do banco             |
| `DB_PASSWORD`        | `Str0ngP@ssword!` | Senha do banco               |
| `DB_DATABASE`        | `frotas`          | Nome do banco                |
| `JWT_SECRET`         | —                 | Chave secreta do JWT         |
| `JWT_EXPIRES_IN`     | `1d`              | Expiração do token           |
| `REDIS_HOST`         | `localhost`       | Host do Redis                |
| `REDIS_PORT`         | `6379`            | Porta do Redis               |
| `CACHE_TTL`          | `300`             | TTL do cache (segundos)      |
| `SEED_USER_PASSWORD` | `aivacol@2024`    | Senha do usuário seed        |

## Arquitetura

Arquitetura modular NestJS seguindo princípios SOLID: cada módulo encapsula controller, service e entidade. Dependências injetadas via DI do framework.

```
src/
├── config/          # Variáveis de ambiente e validação com Joi
├── database/
│   ├── migrations/  # Migrations versionadas (TypeORM CLI)
│   └── seeds/       # Seed do usuário aivacol e veículos do mock
├── modules/
│   ├── auth/        # Login, JWT strategy, guard global
│   ├── brands/      # CRUD de marcas
│   ├── models/      # CRUD de modelos (FK → brands)
│   ├── users/       # CRUD de usuários
│   └── vehicles/    # CRUD de veículos com cache Redis (FK → models)
└── shared/
    ├── cache/       # Configuração global do Redis
    ├── decorators/  # @Public() e @CurrentUser()
    ├── entities/    # BaseEntity: id UUID, timestamps, created_by
    └── filters/     # HttpExceptionFilter — erros padronizados
```
