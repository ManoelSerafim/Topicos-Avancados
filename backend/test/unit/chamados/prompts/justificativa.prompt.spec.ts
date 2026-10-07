import { buildJustificativaPrioridadePrompt } from '../../../../src/chamados/prompts/justificativa.prompt';

describe('buildJustificativaPrioridadePrompt', () => {
  it('inclui a prioridade definida e o chamado entre delimitadores', () => {
    const prompt = buildJustificativaPrioridadePrompt(
      'Sistema ficou indisponível para todos na unidade.',
      'CRITICA',
    );

    expect(prompt).toContain('PRIORIDADE DEFINIDA:\nCRITICA');
    expect(prompt).toContain(
      '<chamado>\nSistema ficou indisponível para todos na unidade.\n</chamado>',
    );
  });

  it('instruí a não reavaliar a prioridade e a focar no impacto', () => {
    const prompt = buildJustificativaPrioridadePrompt(
      'Não consigo acessar o sistema para registrar a aula.',
      'ALTA',
    );

    expect(prompt).toContain(
      'A prioridade "ALTA" já foi definida e deve ser considerada correta.',
    );
    expect(prompt).toContain('NÃO reavalie a prioridade.');
    expect(prompt).toContain(
      'Foque exclusivamente no impacto, impedimento ou ausência de bloqueio',
    );
  });

  it('define limitações e formato da resposta', () => {
    const prompt = buildJustificativaPrioridadePrompt(
      'Preciso de uma declaração de matrícula.',
      'BAIXA',
    );

    expect(prompt).toContain('NÃO mencione a categoria do chamado.');
    expect(prompt).toContain('NÃO mencione o nome da prioridade na resposta.');
    expect(prompt).toContain('A justificativa deve ter no máximo 2 frases.');
    expect(prompt).toContain('Responda somente com a justificativa.');
  });
});
