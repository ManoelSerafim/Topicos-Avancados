import { buildPrioridadePrompt } from './prioridade.prompt';

describe('buildPrioridadePrompt', () => {
  it('inclui o chamado entre delimitadores', () => {
    const prompt = buildPrioridadePrompt('Sistema fora do ar para todos.');

    expect(prompt).toContain(
      '<chamado>\nSistema fora do ar para todos.\n</chamado>',
    );
  });

  it('declara todas as prioridades permitidas', () => {
    const prompt = buildPrioridadePrompt('Preciso de ajuda.');

    for (const prioridade of ['CRITICA', 'ALTA', 'MEDIA', 'BAIXA']) {
      expect(prompt).toContain(prioridade);
    }
  });

  it('orienta o modelo a responder com somente uma prioridade válida', () => {
    const prompt = buildPrioridadePrompt('Não consigo acessar o sistema.');

    expect(prompt).toContain(
      'Retorne somente uma das opções válidas: CRITICA, ALTA, MEDIA, ou BAIXA.',
    );
    expect(prompt).toContain(
      'Se o impacto ou o alcance não estiverem claros, responda REVISAO_HUMANA.',
    );
    expect(prompt).toContain('Use somente as informações presentes no chamado.');
  });
});
