# TaskFlow

Aplicação web para gerenciamento de tarefas, desenvolvida como desafio técnico utilizando Next.js 15, TypeScript e tRPC.

## Tecnologias utilizadas

- **Next.js 15** — framework React com App Router e renderização no servidor.
- **React 19** — construção da interface.
- **TypeScript** — tipagem estática.
- **tRPC** — comunicação entre frontend e backend com tipagem compartilhada.
- **TanStack React Query** — gerenciamento de consultas e atualizações.
- **Zod** — validação dos dados de entrada.
- **CSS** — estilização responsiva.

## Funcionalidades

- Listagem de tarefas com carregamento inicial no servidor (SSR).
- Criação de tarefas.
- Edição de tarefas existentes.
- Exclusão de tarefas com confirmação.
- Validação de campos obrigatórios.
- Mensagens de sucesso e erro.
- Estados de carregamento.
- Armazenamento de dados em memória.

Cada tarefa possui os seguintes atributos:

| Campo | Descrição |
|---|---|
| `id` | Identificador único |
| `titulo` | Título da tarefa |
| `descricao` | Descrição opcional |
| `dataCriacao` | Data e hora de criação |

## Estrutura do projeto

```text
src/
├── app/
│   ├── api/
│   │   └── trpc/
│   │       └── [trpc]/
│   │           └── route.ts
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   ├── Providers.tsx
│   └── TaskManager.tsx
├── lib/
│   └── trpc.ts
└── server/
    ├── task-router.ts
    ├── task-store.ts
    └── trpc.ts
```

## Pré-requisitos

- Node.js 22 ou superior.
- npm.

## Instalação

Clone o repositório:

```bash
git clone git@github.com:Samanta00/taskflow.git
```

Acesse a pasta:

```bash
cd taskflow-next-trpc
```

Instale as dependências:

```bash
npm install
```

## Executando a aplicação

Para iniciar o ambiente de desenvolvimento:

```bash
npm run dev
```

Acesse:

http://localhost:3000

## Build de produção

Para gerar a versão de produção:

```bash
npm run build
```

Para iniciar a aplicação compilada:

```bash
npm run start
```

## Verificação de código

Para executar o ESLint:

```bash
npm run lint
```

## Decisões técnicas

O projeto utiliza o armazenamento em memória, conforme a proposta do desafio, dispensando a configuração de banco de dados.

A comunicação entre a interface e as operações de backend é realizada por meio do tRPC, com validação dos dados utilizando Zod.

A listagem inicial utiliza uma chamada ao roteador tRPC diretamente no servidor, permitindo que as tarefas sejam renderizadas no HTML inicial da aplicação.

**Observação:** por utilizar armazenamento em memória, os dados cadastrados não possuem persistência e podem ser perdidos quando o servidor é reiniciado. Em ambientes com múltiplas instâncias, cada instância também pode manter seu próprio estado.

---

Desenvolvido por **Ellen Samanta**.
