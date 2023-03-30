# **API Desafio Backend PicPay**

[![NPM](https://img.shields.io/npm/l/react)](https://github.com/neliocursos/exemplo-readme/blob/main/LICENSE)

# Autor

👤 Cauã Soares

💼 https://www.linkedin.com/in/ocauasoares/

# Sobre o projeto

## Deploy na plataforma Render:

🚀 https://api-desafio-backend-picpay.onrender.com/ <br>

⚠️ **ATENÇÃO:** O link do Deploy pode demorar um pouco para carregar porque o serviço hiberna por inatividade.

Essa API **RESTful** foi desenvolvida baseada em um desafio técnico de backend da empresa **PicPay**.

# Estrutura do projeto

![Estrutura do projeto](https://raw.githubusercontent.com/ocsoares/images/master/api-picpay/structure.jpg)

O projeto foi desenvolvido seguindo o **Clean Architecture** (Arquitetura Limpa), ou seja, o seu desenvolvimento feito **desacoplado**, separado por **camadas**, com o objetivo de facilitar a leitura do código, da escalabilidade, manutenção e a utilização de testes.

As funcionalidades centrais da aplicação, como cadastro ou login, por exemplo, foram dividas em módulos próprios do NestJS, com seus respectivos use-cases, services, controllers e repositórios, que **dependem** de uma **interface**.

Um exemplo a seguir dessa arquitetura, da funcionalidade de fazer transferências:

## Use-cases e módulos

![Use-cases e módulos](https://raw.githubusercontent.com/ocsoares/images/master/api-picpay/use-cases-e-modulos.jpg)

![Use-cases e módulos transfer](https://raw.githubusercontent.com/ocsoares/images/master/api-picpay/use-cases-e-modulos-transfer.jpg)

## Service

![Service](https://raw.githubusercontent.com/ocsoares/images/master/api-picpay/service.jpg)

## Controller

![Controller](https://raw.githubusercontent.com/ocsoares/images/master/api-picpay/controller.jpg)

## Repositório

![Repositório](https://raw.githubusercontent.com/ocsoares/images/master/api-picpay/transfer-repository.jpg)

## Implementação do Repositório

![Implementação do Repositório](https://raw.githubusercontent.com/ocsoares/images/master/api-picpay/prisma-transfer-repository.jpg)

## Injeção de Dependência do Repositório

![Injeção de Dependência do Repositório](https://raw.githubusercontent.com/ocsoares/images/master/api-picpay/prisma-database-module.jpg)

# Principais tecnologias e bibliotecas utilizadas

-   NodeJS
-   NestJS
-   Typescript
-   Docker
-   PostgreSQL
-   Prisma
-   bcrypt
-   class-validator (validação dos DTOs)
-   passport
-   JWT
-   Axios
-   Jest
-   Swagger (para documentação)

## Características e funcionalidades do projeto:

### Estrutural 🛠️

-   Clean Code
-   SOLID
-   Clean Architecture
-   Banco de dados usado no **Docker**
    <br>
    <br>

### Rotas e validação 🔒

-   DTOs validados com os tipos corretos para a requisição
-   Rota de cadastramento e de login
-   No sistema podem ser cadastrado contas de **usuários** e de **lojistas**
-   Rota **/me** para conferir as atuais informações do usuário autenticado com um token JWT
-   Rota protegida para realizar uma transferência bancária para um usuário válido
    <br>
    <br>

### Funcionalidades 🎯

-   **Usuários** podem realizar transferências para outros usuários e para lojistas
-   **Lojistas** podem apenas **receber** transferências, não podem enviar dinheiro para nenhuma conta
-   Usuários só podem realizar transferências com saldo positivo
-   Consulta à uma **API externa** de autorização antes de finalizar a transferência
-   Consulta à uma **API externa** de notificação para a conta recebedora da transferência

# Documentação

Documentação feita com a ferramenta Swagger na rota **/docs**

![Documentação](https://raw.githubusercontent.com/ocsoares/images/master/api-picpay/docs.jpg)

# Executar o projeto localmente

Pré-requisitos: Typescript, NodeJS, Docker

```bash
# clonar o repositório
git clone https://github.com/ocsoares/API-Desafio-Backend-PicPay

# instalar as bibliotecas
npm install

# criar um arquivo .env na pasta raíz do projeto

# configurar esse .env baseado no arquivo .env.example

# transpilar os arquivos do projeto para .js
npm run build

# iniciar o container do docker
docker-compose up -d

# executar o projeto
npm start
```

# Testes

Foi desenvolvido testes para mais de **90%** das funcionalidades desse projeto. Pode-se executar os testes com o comando:

```bash
npm test
```
