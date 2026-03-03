# Investment Simulation Calculator API

API REST para cálculo e comparação de simulações de investimentos em renda fixa e renda variável.

## Requisitos

* Node.js 16.16.0 ou superior
* MongoDB (local ou MongoDB Atlas)
* npm 6.14.7 ou superior

## Instalação

```bash
npm install
```

## Configuração

Crie um arquivo `.env` na raiz do projeto com as seguintes variáveis:

```env
MONGO_URI=mongodb://localhost:27017/investment-calculator
JWT_SECRET=seu_secret_aqui
PORT=4000
```

## Executar o Projeto

### Desenvolvimento (com hot-reload)
```bash
npm run dev
```

### Produção
```bash
npm start
```

A aplicação estará disponível em http://localhost:4000/

## Arquitetura de Dados

### Estratégia de Armazenamento

A API utiliza uma abordagem de **cálculo único e armazenamento completo** dos resultados. Quando uma simulação é criada:

1. Os cálculos de renda fixa e variável são executados uma única vez no momento da criação
2. Todos os resultados (valores finais, impostos, evolução mensal) são armazenados no banco de dados
3. Consultas posteriores retornam os dados pré-calculados, sem necessidade de reprocessamento

**Vantagens desta abordagem:**
- Performance: Consultas extremamente rápidas, sem overhead de cálculo
- Consistência: Resultados idênticos em todas as consultas (importante para renda variável com aleatoriedade)
- Histórico: Preserva o estado exato da simulação no momento da criação
- Escalabilidade: Reduz carga computacional em consultas frequentes

### Schema de Simulação

A collection `simulations` armazena:
- Parâmetros de entrada (valor inicial, contribuição mensal, taxas, etc.)
- Resultados completos de renda fixa (com IR e IOF)
- Resultados completos de renda variável
- Evolução mensal de ambos os investimentos
- Comparação percentual entre as modalidades

## Endpoints

### Autenticação
- `POST /auth` - Login
- `POST /auth/create` - Criar conta

### Simulações
- `POST /simulation/create` - Criar nova simulação
- `GET /simulation/list` - Listar todas as simulações
- `GET /simulation/:id` - Obter detalhes de uma simulação
- `DELETE /simulation/:id` - Deletar uma simulação

## Cálculos Implementados

### Renda Fixa
- Juros compostos mensais
- Imposto de Renda (IR) progressivo por prazo
- IOF (Imposto sobre Operações Financeiras) para períodos < 30 dias
- Evolução mensal do patrimônio

### Renda Variável
- Retorno estocástico com distribuição normal
- Volatilidade ajustada mensalmente
- Evolução mensal do patrimônio

## Scripts Disponíveis

```bash
npm run dev          # Desenvolvimento com nodemon
npm start            # Produção
npm test             # Executar testes
npm run lint:check   # Verificar código
npm run lint:fix     # Corrigir problemas de lint
npm run prettier:fix # Formatar código
npm run fix          # Formatar e corrigir lint
```