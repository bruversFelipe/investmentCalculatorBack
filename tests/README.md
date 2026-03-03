# Testes Unitários - API

## Executar Testes

```bash
npm test
```

## Cobertura de Testes

### calculations.test.js

Testes completos para todas as funções de cálculo de investimentos:

#### calculateIR (6 testes)
- ✓ Aplica 22.5% para períodos até 180 dias
- ✓ Aplica 20% para períodos 181-360 dias
- ✓ Aplica 17.5% para períodos 361-720 dias
- ✓ Aplica 15% para períodos acima de 720 dias
- ✓ Trata lucro zero
- ✓ Trata lucro negativo (edge case)

#### calculateIOF (5 testes)
- ✓ Retorna 0 para períodos >= 30 dias
- ✓ Aplica 96% para 1 dia
- ✓ Aplica taxa regressiva para 2-29 dias
- ✓ IOF decresce conforme dias aumentam
- ✓ Trata lucro zero

#### normalRandom (4 testes)
- ✓ Retorna um número válido
- ✓ Gera valores ao redor da média
- ✓ Trata desvio padrão zero
- ✓ Trata média negativa

#### calculateFixedIncome (8 testes)
- ✓ Calcula renda fixa sem contribuições mensais
- ✓ Calcula renda fixa com contribuições mensais
- ✓ Aplica juros compostos corretamente
- ✓ Calcula IR corretamente para 12 meses
- ✓ Não aplica IOF para períodos >= 30 dias
- ✓ Calcula lucro líquido após impostos
- ✓ Rastreia evolução mensal corretamente
- ✓ Retorna todos os campos obrigatórios
- ✓ Trata taxa anual zero

#### calculateVariableIncome (6 testes)
- ✓ Calcula renda variável sem contribuições mensais
- ✓ Calcula renda variável com contribuições mensais
- ✓ Retorna todos os campos obrigatórios
- ✓ Rastreia evolução mensal corretamente
- ✓ Trata volatilidade zero (determinístico)
- ✓ Produz resultados diferentes com volatilidade (estocástico)
- ✓ Trata retorno anual zero

#### calculateComparison (7 testes)
- ✓ Calcula diferença positiva quando variável > fixa
- ✓ Calcula diferença negativa quando variável < fixa
- ✓ Retorna 0 quando valores são iguais
- ✓ Trata valores decimais corretamente
- ✓ Trata grandes diferenças
- ✓ Trata valores pequenos
- ✓ Retorna percentual como número

## Total: 38 testes passando ✓

## Configuração

O projeto usa ES Modules, então o Jest é executado com:
```bash
node --experimental-vm-modules node_modules/jest/bin/jest.js
```

Configuração em `jest.config.js`:
- Test environment: Node.js
- Suporte a ES Modules
- Mapeamento de paths com `@/`
