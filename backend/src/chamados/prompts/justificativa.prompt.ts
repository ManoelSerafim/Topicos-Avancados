import { ChamadoPrioridade } from '../domain/chamado-prioridade';

export function buildJustificativaPrioridadePrompt(
  texto: string,
  prioridade: ChamadoPrioridade,
): string {
  return `
Gere somente a justificativa da prioridade já definida para este chamado.

PRIORIDADE DEFINIDA:
${prioridade}

CRITÉRIOS:
- CRITICA: indisponibilidade ampla, risco imediato ou impacto grave explicitamente informado.
- ALTA: uma pessoa ou processo importante está completamente impedido de funcionar.
- MEDIA: há impacto parcial ou existe uma alternativa temporária para continuar o processo.
- BAIXA: dúvida, solicitação sem bloqueio ou pedido de melhoria.

TAREFA:
Identifique no chamado a informação que demonstra o nível de impacto e explique, em uma frase, por que essa informação justifica a prioridade definida.

REGRAS OBRIGATÓRIAS:
- A prioridade "${prioridade}" já foi definida e deve ser considerada correta.
- NÃO escolha outra prioridade.
- NÃO reavalie a prioridade.
- NÃO mencione a categoria do chamado.
- NÃO mencione o nome da prioridade na resposta.
- NÃO repita o chamado inteiro.
- NÃO invente informações que não estejam no chamado.
- NÃO presuma quantidade de usuários, abrangência, prejuízo, urgência ou consequências que não estejam explicitamente informadas.
- Use somente evidências presentes no chamado.
- Foque exclusivamente no impacto, impedimento ou ausência de bloqueio que justifica a prioridade.
- Responda somente com a justificativa.
- A justificativa deve ter no máximo 2 frases.
- Não use títulos, listas, aspas ou explicações adicionais.

<chamado>
${texto.trim()}
</chamado>
  `.trim();
}
