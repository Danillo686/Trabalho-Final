# 🎓 Trilha de Estudos com IA

Aplicação web full-stack que usa Inteligência Artificial (via **Groq + LLaMA 3**) para gerar trilhas de estudo personalizadas com base no nível de conhecimento do estudante.

---

## ✨ Funcionalidades

- **Cadastro e Login** com senha criptografada (bcrypt) e autenticação JWT
- **Diagnóstico inteligente** — responda um questionário e a IA identifica suas lacunas
- **Trilha personalizada** — a IA gera tópicos de estudo com base nas suas lacunas
- **Questões de avaliação** — a IA cria 3 questões de múltipla escolha por tópico
- **Feedback educacional** — a IA corrige suas respostas e explica os erros
- **Painel de desempenho** — veja seu histórico de tópicos concluídos com placar

---

## 🛠️ Tecnologias

| Camada    | Tecnologia                              |
|-----------|-----------------------------------------|
| Frontend  | React + Vite + React Router DOM + Axios |
| Backend   | Node.js + Express                       |
| Banco     | MySQL                                   |
| IA        | Groq API (modelo LLaMA 3 8B)            |
| Auth      | JWT + bcryptjs                          |

---

## 📋 Pré-requisitos

Antes de começar, você precisa ter instalado:

- [Node.js](https://nodejs.org/) (versão 18 ou superior)
- [MySQL](https://www.mysql.com/) (versão 8 ou superior)
- Uma conta e chave de API no [Groq Console](https://console.groq.com)

---

## 🚀 Como rodar o projeto

### 1. Clone o repositório

```bash
git clone <url-do-repositorio>
cd Trabalho-Final
```

### 2. Configure o Banco de Dados (MySQL)

Abra o MySQL e execute os comandos abaixo para criar o banco e as tabelas:

```sql
CREATE DATABASE IF NOT EXISTS data_base;
USE data_base;

-- Tabela de usuários
CREATE TABLE IF NOT EXISTS usuarios (
    id            INT PRIMARY KEY AUTO_INCREMENT,
    name_user     VARCHAR(120) NOT NULL,
    password_user VARCHAR(120) NOT NULL
);

-- Tabela de progresso (ou use o script de migração — veja o passo 4)
CREATE TABLE IF NOT EXISTS progresso (
    id            INT AUTO_INCREMENT PRIMARY KEY,
    estudante_id  INT NOT NULL,
    topico_id     VARCHAR(50) NOT NULL,
    topico_titulo VARCHAR(255),
    acertos       INT DEFAULT 0,
    total         INT DEFAULT 0,
    data          DATETIME DEFAULT NOW()
);
```

### 3. Configure as variáveis de ambiente do Backend

```bash
cd backend
cp .env.example .env
```

Abra o arquivo `backend/.env` e preencha com seus dados:

```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=sua_senha_do_mysql
DB_NAME=data_base

JWT_SECRET=troque_por_uma_chave_longa_e_aleatoria

GROQ_API_KEY=gsk_xxxxxxxxxxxxxxxxxxxx

PORT=3000
```

> **Onde colocar a chave do Groq?** Veja a seção abaixo.

### 4. Instale as dependências e inicie o Backend

```bash
cd backend
npm install

# (Opcional) Crie a tabela 'progresso' automaticamente via script:
npm run migrate

# Inicie o servidor:
npm start
```

O servidor estará rodando em `http://localhost:3000`.

### 5. Instale as dependências e inicie o Frontend

```bash
cd frontend
npm install
npm run dev
```

O frontend estará disponível em `http://localhost:5173`.

---

## 🔑 Como obter a chave da API do Groq

1. Acesse [https://console.groq.com](https://console.groq.com)
2. Crie uma conta gratuita (pode usar Google ou GitHub)
3. No menu lateral, clique em **"API Keys"**
4. Clique em **"Create API Key"**, dê um nome e copie a chave gerada
5. Cole a chave no arquivo `backend/.env` na variável `GROQ_API_KEY`

> A chave tem o formato `gsk_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`.

---

## 📁 Estrutura do projeto

```
Trabalho-Final/
├── backend/
│   ├── controllers/
│   │   ├── authController.js       # Cadastro e login
│   │   ├── iaController.js         # Integração com Groq
│   │   └── progressoController.js  # Histórico do estudante
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── iaRoutes.js
│   │   └── progressoRoutes.js
│   ├── db.js                       # Conexão com MySQL
│   ├── migrate.js                  # Script de criação das tabelas
│   ├── server.js                   # Inicialização do Express
│   ├── .env                        # Variáveis de ambiente (NÃO commitar!)
│   └── .env.example                # Modelo do .env
│
└── frontend/
    └── src/
        ├── components/             # Componentes reutilizáveis
        ├── context/                # Estado global (EstudanteContext)
        ├── data/                   # Configuração do Axios
        ├── hooks/                  # Hooks personalizados
        ├── pages/                  # Uma página por rota
        ├── App.jsx                 # Definição das rotas
        └── main.jsx                # Ponto de entrada
```

---

## 🗺️ Rotas da aplicação

| Rota             | Página       | Descrição                              |
|------------------|--------------|----------------------------------------|
| `/`              | Login        | Tela de autenticação                   |
| `/cadastro`      | Cadastro     | Criação de conta                       |
| `/lobby`         | Lobby        | Menu principal pós-login               |
| `/diagnostico`   | Diagnóstico  | Questionário de avaliação de nível     |
| `/trilha`        | Trilha       | Trilha de estudos gerada pela IA       |
| `/topico/:id`    | Tópico       | Questões e avaliação de um tópico      |
| `/painel`        | Painel       | Histórico de desempenho do estudante   |

## 🌐 Endpoints da API

| Método | Rota                       | Descrição                            |
|--------|----------------------------|--------------------------------------|
| POST   | `/cadastro`                | Cadastra um novo usuário             |
| POST   | `/login`                   | Autentica e retorna token JWT        |
| POST   | `/ia/diagnostico`          | Analisa respostas e acha lacunas     |
| POST   | `/ia/trilha`               | Gera trilha de tópicos               |
| POST   | `/ia/questoes`             | Gera questões sobre um tópico        |
| POST   | `/ia/avaliar`              | Avalia respostas e gera feedback     |
| POST   | `/progresso`               | Salva resultado de um tópico         |
| GET    | `/progresso/:estudanteId`  | Busca histórico do estudante         |

---

## ⚠️ Atenção

- **Nunca** commite o arquivo `.env` no Git — ele contém senhas e chaves secretas.
- O arquivo `.gitignore` já deve ignorar o `.env` automaticamente.