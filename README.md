# API de Chamados com IA

Sistema de classificação e priorização de chamados de suporte utilizando NestJS, Ollama (LLM local via Docker) e PostgreSQL.

## Arquitetura

```
├── backend/          # API NestJS (porta 3000)
├── frontend/         # Angular (porta 4200)
├── docker-compose.yml
└── README.md
```

## Pré-requisitos

- Docker e Docker Compose
- Node.js 20+ (para desenvolvimento local)

## Como Executar

### Com Docker Compose (Recomendado)

```bash
# Subir todos os serviços
docker compose up -d

# Ver logs da API
docker compose logs -f api-topic

# Ver logs do Ollama
docker compose logs -f ollama

# Parar tudo
docker compose down
```

Serviços disponíveis:
- **API**: http://localhost:3000
- **Frontend**: http://localhost:4200
- **Ollama**: http://localhost:11434

### Desenvolvimento Local (Backend)

```bash
cd backend
npm install
cp .env.example .env  # Ajuste OLLAMA_BASE_URL se necessário
npm run start:dev
```

## Configuração do Ollama

O Ollama roda em container Docker. Para instalar modelos:

```bash
# Entrar no container
docker exec -it ollama bash

# Baixar modelo (ex: qwen2.5:0.5b)
ollama pull qwen2.5:0.5b

# Listar modelos instalados
ollama list
```

Variáveis de ambiente (`.env` do backend):
```env
OLLAMA_BASE_URL=http://ollama:11434
OLLAMA_MODEL=qwen2.5:0.5b
OLLAMA_TIMEOUT_MS=30000
```

## Endpoints da API

### Classificação de Chamados

Retorna a categoria do chamado (ACESSO, FINANCEIRO, MATRICULA, DOCUMENTOS, OUTROS).

```http
POST /chamados/classificar
Content-Type: application/json

{
  "texto": "Minha senha expirou e não consigo entrar no sistema."
}
```

**Resposta:**
```json
{
  "texto": "Minha senha expirou e não consigo entrar no sistema.",
  "categoria": "ACESSO",
  "modelo": "qwen2.5:0.5b"
}
```

### Priorização de Chamados

Retorna a prioridade (BAIXA, MEDIA, ALTA, CRITICA, REVISAO_HUMANA) com justificativa baseada no impacto descrito.

```http
POST /chamados/priorizar
Content-Type: application/json

{
  "texto": "Sistema de folha de pagamento fora do ar para toda a empresa desde as 8h. Ninguém consegue processar salários."
}
```

**Resposta:**
```json
{
  "texto": "Sistema de folha de pagamento fora do ar para toda a empresa desde as 8h. Ninguém consegue processar salários.",
  "prioridade": "CRITICA",
  "justificativa": "Indisponibilidade ampla do sistema de folha de pagamento impede o processamento de salários de todos os funcionários.",
  "modelo": "qwen2.5:0.5b",
  "revisaoHumana": false
}
```

**Prioridades:**
| Prioridade | Critério |
|------------|----------|
| CRITICA | Indisponibilidade ampla, risco imediato ou impacto grave explicitamente informado |
| ALTA | Uma pessoa ou processo importante completamente impedido |
| MEDIA | Impacto parcial ou alternativa temporária disponível |
| BAIXA | Dúvida, solicitação sem bloqueio ou melhoria |
| REVISAO_HUMANA | Impacto ou alcance não claros no chamado |

### Chat com IA (Genérico)

```http
POST /ia/responder
Content-Type: application/json

{
  "mensagem": "Explique o que é clean architecture."
}
```

**Resposta:**
```json
{
  "resposta": "Clean Architecture é...",
  "modelo": "qwen2.5:0.5b",
  "uso": { "tokensEntrada": 15, "tokensSaida": 120 }
}
```

### Streaming de Resposta

```http
POST /ia/responder-stream
Content-Type: application/json

{
  "mensagem": "Conte uma piada curta."
}
```

Resposta: NDJSON (uma linha por token)
```json
{"type":"delta","content":"Aqui"}
{"type":"delta","content":" está"}
{"type":"delta","content":" uma"}
{"type":"delta","content":" piada"}
{"type":"done"}
```

## Testes

```bash
cd backend

# Testes unitários
npm test

# Testes com coverage
npm run test:cov

# Testes e2e
npm run test:e2e

# Avaliação de classificação (requer Ollama rodando)
npm run avaliar:chamados

# Avaliação de pioridade (requer Ollama rodando)
npm run avaliar:prioridade
```

## Regras de Negócio - Priorização

A priorização segue regras estritas definidas no prompt:

1. **Apenas informações do chamado** - Não usa conhecimento externo
2. **Não inventa dados** - Sem quantidade de usuários, prazos, prejuízos não informados
3. **REVISAO_HUMANA** - Quando impacto/alcance não estão claros
4. **JSON válido** - Modelo responde apenas com JSON estruturado
5. **Validação no backend** - Prioridade e justificativa são validadas antes de retornar

## Estrutura do Backend

```
backend/src/
├── chamados/
│   ├── chamados.controller.ts    # Endpoints /chamados/*
│   ├── chamados.service.ts       # Lógica: classificar() + priorizar()
│   ├── chamados.module.ts
│   ├── dto/
│   │   ├── classificar-chamado.dto.ts
│   │   └── priorizar-chamado.dto.ts
│   ├── domain/                   # Tipos puros (sem deps externas)
│   │   ├── chamado-categoria.ts
│   │   └── chamado-prioridade.ts
│   ├── prompts/                  # Prompts isolados (infraestrutura)
│   │   ├── classificacao.prompt.ts
│   │   └── priorizacao.prompt.ts
│   └── avaliacao/                # Scripts de avaliação de acurácia
├── ia/
│   ├── ia.controller.ts          # Endpoints /ia/*
│   ├── ia.service.ts
│   ├── ia.module.ts
│   └── providers/
│       ├── ollama.provider.ts    # Implementação HTTP do Ollama
│       └── modelo.provider.ts    # Interface do provedor
└── conversas/                    # Gestão de conversas (sessões)
```

## Licença

UNLICENSED - Projeto acadêmico