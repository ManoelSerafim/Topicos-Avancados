import { buildPriorizacaoPrompt } from '../../../../src/chamados/prompts/priorizacao.prompt';

describe('buildPriorizacaoPrompt', () => {
  it('inclui o chamado entre delimitadores', () => {
    const prompt = buildPriorizacaoPrompt('Sistema fora do ar para todos.');

    expect(prompt).toContain('<chamado>\nSistema fora do ar para todos.\n</chamado>');
  });

  it('declara todas as prioridades permitidas', () => {
    const prompt = buildPriorizacaoPrompt('Preciso de ajuda.');

    for (const prioridade of ['CRITICA', 'ALTA', 'MEDIA', 'BAIXA', 'REVISAO_HUMANA']) {
      expect(prompt).toContain(prioridade);
    }
  });

  it('orienta o modelo a responder com JSON válido', () => {
    const prompt = buildPriorizacaoPrompt('Não consigo acessar o sistema.');

    expect(prompt).toContain('JSON válido');
    expect(prompt).toContain('prioridade');
    expect(prompt).toContain('justificativa');
  });

  it('inclui regra de revisão humana para impacto não claro', () => {
    const prompt = buildPriorizacaoPrompt('Preciso de ajuda.');

    expect(prompt).toContain('REVISAO_HUMANA');
    expect(prompt).toContain('impacto ou o alcance não estiverem claros');
  });

  it('proíbe inventar informações', () => {
    const prompt = buildPriorizacaoPrompt('Sistema lento.');

    expect(prompt).toContain('Não invente quantidade de usuários');
    expect(prompt).toContain('Não utilize conhecimento externo');
  });
});