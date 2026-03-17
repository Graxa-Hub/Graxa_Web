[![Review Assignment Due Date](https://classroom.github.com/assets/deadline-readme-button-22041afd0340ce965d47ae6ef1cefeee28c7c493a6346c4f15d667ab976d596c.svg)](https://classroom.github.com/a/O7RWLN6-)
# Kanban API — Desafio de Refatoração

## Contexto

Este repositório é um template de uma API REST de Kanban implementada em **Arquitetura em Camadas** (Layered Architecture). Sua missão é refatorar o código para **Clean Architecture**, mantendo tudo funcionando exatamente como antes.

Existe um frontend React pronto que consome a API. Existe uma suíte de testes BDD (Cucumber + RestAssured) que cobre todos os endpoints. **Ambos servem como rede de segurança** — se você quebrar o comportamento da API, os testes vão te avisar.

---

## O que você precisa fazer

Refatorar o backend para Clean Architecture **sem alterar o contrato da API** (mesmos endpoints, mesmos status codes, mesmos payloads).

O comportamento observável deve ser idêntico ao original. O que muda é a **organização interna** do código.

---

## Estrutura de pacotes esperada

Após a refatoração, o código deve estar organizado nos seguintes pacotes:

```
com.kanban
├── domain/
│   ├── (entidade Task — sem anotações de framework)
│   ├── (enum TaskStatus)
│   └── (interface TaskGateway — contrato do repositório)
│
├── usecase/
│   └── (lógica de negócio — sem Spring Web, sem JPA)
│
└── infrastructure/
    ├── persistence/
    │   ├── (entidade JPA mapeada para o banco)
    │   └── (implementação de TaskGateway usando Spring Data)
    └── web/
        └── (controller REST)
```

> Os nomes das classes e interfaces ficam a seu critério, desde que os pacotes existam e as dependências fluam na direção correta.

---

## Regras que os testes verificam

### Regra de pureza do domínio
O pacote `domain` não pode importar nada de `org.springframework` nem de `jakarta.persistence`.
O domínio é Java puro — não conhece nenhum framework.

### Regra de isolamento do caso de uso
O pacote `usecase` não pode importar nada de `infrastructure`.
O caso de uso conversa com o domínio por meio de interfaces — nunca com JPA diretamente.

### Regra de inversão de dependência
O pacote `infrastructure.web` (controller) não pode acessar `infrastructure.persistence` (JPA) diretamente.
O controller chama o caso de uso, que usa o gateway — nunca o JPA diretamente.

---

## O que NÃO muda

- Os endpoints da API (`/api/tasks`, verbos, status codes)
- Os DTOs de request e response (podem ser movidos, mas o formato JSON fica igual)
- O banco H2 em memória
- O comportamento do frontend
- Os testes BDD — eles continuam sendo a validação final

---

## Como executar localmente

**Pré-requisito:** Java 21 e Node 20+

```bash
# Backend
./mvnw spring-boot:run

# Todos os testes (BDD + arquitetura)
./mvnw test

# Teste de um cenário específico
./mvnw test -Dcucumber.filter.tags=@criar-task

# Frontend
cd kanban-frontend
npm install
npm run dev   # http://localhost:5173
```

---

## Pontuação

| # | Grupo | Critério | Pontos |
|---|---|---|---|
| 1–16 | **Funcional** | 16 cenários BDD passando | 1 pt cada = **16 pts** |
| 17 | **Arch** | `Task` está em `com.kanban.domain` | **3 pts** |
| 18 | **Arch** | Interface `TaskGateway` existe em `com.kanban.domain` | **3 pts** |
| 19 | **Arch** | Pacote `com.kanban.usecase` existe e tem classes | **3 pts** |
| 20 | **Arch** | Pacote `com.kanban.infrastructure` existe e tem classes | **3 pts** |
| 21 | **Arch** | `domain` não importa Spring nem JPA | **2 pts** |
| 22 | **Arch** | `usecase` não importa `infrastructure` | **2 pts** |
| 23 | **Arch** | Controller não acessa persistence diretamente | **2 pts** |
| | | **Total** | **34 pts** |

> **Atenção:** entregar o template sem refatorar resulta em **22/34 pts** (65%) — os testes 17, 18, 19 e 20 falham automaticamente no código original.

---

## Desafio extra (não vale nota)

Implemente um **gateway em memória** (`InMemoryTaskGateway`) como alternativa ao gateway JPA.

Faça com que a suíte BDD inteira continue passando com o gateway em memória no lugar do JPA, sem alterar nenhum teste e sem alterar o caso de uso.

Isso demonstra que a Clean Architecture foi implementada corretamente: se o caso de uso não conhece o gateway concreto, trocar a implementação não quebra nada.

---

## Stack

| Camada | Tecnologia |
|---|---|
| Backend | Spring Boot 3.3, Java 21, H2 |
| Testes | Cucumber 7, RestAssured 5, ArchUnit 1.3 |
| Frontend | Vite + React (JS puro) |
| Pipeline | GitHub Actions + education/autograding |
