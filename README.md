# B4YOU - Plataforma de Gestão de Produtos

![CI](https://github.com/rodrigodiasz/b4you/actions/workflows/ci.yml/badge.svg)

B4YOU é uma plataforma moderna e robusta para gestão de produtos com, autenticação JWT, filtros avançados, relatórios e uma interface intuitiva. O projeto é fullstack, com frontend em Next.js/React e backend em Node.js/Express/Sequelize.

---


## 🌐 Deploy em Nuvem (Demonstração)
A versão mais recente do projeto está disponível online para testes:
https://b4you.rodrigoliveira.space/

Hospedagem: Todo o projeto está rodando em uma VPS própria utilizando Coolify, com containers orquestrados via Docker Compose.

Frontend: Aplicação Next.js.

Backend: API Node.js com Express, conectada ao MySQL e Redis.

Funcionalidades ativas: Login JWT, CRUD de produtos, filtros, dashboard e dark mode.

---

## 🚀 Visão Geral

- **Gestão de Produtos:** Cadastro, edição, exclusão, visualização e busca de produtos com categorias.
- **Dashboard:** Estatísticas em tempo real, cards de resumo, ações rápidas.
- **Autenticação JWT:** Segurança para rotas protegidas.
- **UI/UX Moderna:** Responsivo, dark mode, componentes Shadcn UI.
- **Filtros Avançados:** Busca, ordenação (A-Z, preço, estoque, data), filtro por categoria, paginação.
- **Notificações:** Feedback ao usuário com Sonner.
- **Infraestrutura:** Docker, Redis, MySQL, Sequelize ORM.

---

## 🏗️ Arquitetura do Projeto

```
B4/
├── backend/         # API Node.js/Express/Sequelize
│   ├── src/
│   │   ├── models/      # Modelos Sequelize
│   │   ├── routes/      # Rotas Express
│   │   ├── middleware/  # Middlewares (auth, etc)
│   │   ├── config/      # Configuração do banco
│   │   ├── migrations/  # Migrations Sequelize
│   │   ├── seeders/     # Seeders Sequelize
│   │   └── ...
│   ├── package.json
│   └── ...
├── frontend/        # Next.js/React/TypeScript
│   ├── src/
│   │   ├── app/         # Páginas (Next.js App Router)
│   │   ├── components/  # Componentes reutilizáveis
│   │   ├── lib/         # Utils, API client
│   │   └── ...
│   ├── public/      # Assets
│   ├── package.json
│   └── ...
├── docker-compose.yml
└── README.md
```

---

## ⚡ Instalação e Setup

### Pré-requisitos

- Node.js 18+
- Docker e Docker Compose

### 1. Clone o repositório

```bash
# Clone o projeto
git clone https://github.com/rodrigodiasz/b4you.git
cd B4
```

### 2. Instale as dependências

```bash
# Backend
npm install # ou yarn install
cd ../frontend
npm install # ou yarn install
```

### 3. Configure as variáveis de ambiente

- Copie `.env.example` para `.env` em **backend** e **frontend**.
- Ajuste as variáveis conforme seu ambiente (veja exemplos abaixo).

### 4. Suba os serviços do Docker (MySQL, Redis)

```bash
cd .. # na raiz do projeto
docker-compose up -d
```

### 5. Rode as migrations e seeders

```bash
cd backend
npx sequelize-cli db:migrate
npx sequelize-cli db:seed:all # (opcional, para dados de exemplo)
```

---

## 🟢 Rodando o Projeto

### Backend

```bash
cd backend
npm run dev
```

### Frontend

```bash
cd frontend
npm run dev
```

Acesse: [http://localhost:3000](http://localhost:3000)

---

## 📝 Exemplo de `.env.example`

### backend/.env.example

```env
# Banco de dados
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASS=senha
DB_NAME=b4you

# JWT
JWT_SECRET=sua_chave_secreta

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379

# Frontend
CORS_ORIGIN=http://localhost:3000

```

### frontend/.env.example

```env
# URL da API do backend
NEXT_PUBLIC_API_URL=http://localhost:3333
```

---

## 🛠️ Comandos Úteis

- Subir containers: `docker-compose up -d`
- Parar containers: `docker-compose down`
- Rodar migrations: `npx sequelize-cli db:migrate`
- Rodar seeders: `npx sequelize-cli db:seed:all`
- Rodar backend: `npm run dev` (backend)
- Rodar frontend: `npm run dev` (frontend)

---

## 💡 Funcionalidades

- [x] Autenticação JWT (login/logout)
- [x] CRUD de produtos com categorias
- [x] Busca, filtro por categoria, ordenação, paginação
- [x] Dashboard com cards de estatísticas
- [x] UI responsiva, dark mode, componentes modernos
- [x] Notificações de sucesso/erro
- [x] Proteção de rotas (só acessa produtos/relatórios logado)

---

## 🤖 Funcionalidade de IA 

O B4YOU possui integração com IA (ChatGPT) para auxiliar em tarefas como sugestões automáticas de nome e descrição de produtos.

**Para utilizar a funcionalidade de IA, é necessário:**

- Ter uma conta na [OpenAI](https://platform.openai.com/).
- Gerar uma chave de API no painel da OpenAI.
- Adicionar a chave no arquivo `.env` do backend.

### Exemplo de variável no `.env.example` do backend:

```env
# Chave da API OpenAI para funcionalidades de IA
OPENAI_API_KEY=sua_openai_api_key_aqui
```

> **Importante:** Sem a chave, as funções de IA não estarão disponíveis.

### Como obter sua chave:

1. Acesse https://platform.openai.com/api-keys
2. Clique em "Create new secret key"
3. Copie a chave gerada e cole na variável acima

---

## 🏭 Deploy e Produção

- Ajuste as variáveis de ambiente para produção (banco, JWT, Redis, etc).
- Use serviços como Railway, Vercel, Heroku, AWS, DigitalOcean, etc.
- O backend pode ser deployado em qualquer serviço Node.js.
- O frontend pode ser deployado em Vercel, Netlify, etc.
- **Nunca exponha segredos no frontend!**
- Use HTTPS em produção.

---

## 🧹 Padronização de Código (ESLint + Prettier)

- O projeto utiliza **ESLint** para garantir boas práticas e qualidade de código (frontend).
- O **Prettier** está configurado para formatação automática e consistente do código.
- Para checar e corrigir o estilo de código, use:

```bash
# Checar problemas de formatação
npm run lint      # ESLint
npm run format    # Prettier (corrige automaticamente)
```

Sempre rode o Prettier antes de commitar para evitar erros no CI.

---

## 🤖 CI/CD com GitHub Actions

- O repositório possui um workflow de **CI** em `.github/workflows/ci.yml`.
- O workflow executa automaticamente em cada push ou pull request na branch `main`:
  - **Frontend:**
    - Instala dependências
    - Roda ESLint
    - Roda Prettier (checa formatação)
    - Roda build do Next.js
  - **Backend:**
    - Instala dependências
    - Roda build do TypeScript
- Se algum passo falhar, o merge/deploy é bloqueado.
- O deploy automático pode ser feito via Coolify ou outro serviço integrado ao GitHub.

---

## 🧩 Troubleshooting

- **Erro de conexão com banco:** Verifique se o MySQL está rodando e as variáveis de ambiente estão corretas.
- **Frontend não conecta com backend:** Confirme a URL em `NEXT_PUBLIC_API_URL`.
- **Problemas com migrations:** Rode `npx sequelize-cli db:migrate:undo:all` e depois `db:migrate`.
- **Permissões:** Certifique-se que as portas 3000 (frontend), 3333 (backend), 3306 (MySQL), 6379 (Redis) estão livres.

---

## 📚 Links Úteis

- [Documentação Next.js](https://nextjs.org/docs)
- [Documentação Express](https://expressjs.com/pt-br/)
- [Sequelize ORM](https://sequelize.org/)
- [Shadcn UI](https://ui.shadcn.com/)
- [Docker Compose](https://docs.docker.com/compose/)

---
