import type { ChamadoPrioridade } from '../domain/chamado-prioridade';

export interface CasoAvaliacaoPrioridade {
  id: string;
  texto: string;
  esperado: ChamadoPrioridade;
  justificativaDeveConter: string[];
  tipo: 'normal' | 'fronteira' | 'ausencia' | 'adversarial';
}

export const CASOS_AVALIACAO_PRIORIDADE: CasoAvaliacaoPrioridade[] = [
  {
    id: 'duvida-sem-bloqueio-01',
    texto: 'Tenho uma duvida sobre como consultar meu historico academico.',
    esperado: 'BAIXA',
    justificativaDeveConter: ['duvida', 'sem bloqueio'],
    tipo: 'normal',
  },
  {
    id: 'tarefa-essencial-bloqueada-01',
    texto:
      'Nao consigo emitir o documento obrigatorio para concluir minha matricula.',
    esperado: 'ALTA',
    justificativaDeveConter: ['tarefa essencial', 'impedido'],
    tipo: 'normal',
  },
  {
    id: 'indisponibilidade-ampla-01',
    texto:
      'Varias pessoas do setor estao sem acesso ao sistema e nao conseguem trabalhar.',
    esperado: 'CRITICA',
    justificativaDeveConter: ['varias pessoas', 'indisponibilidade'],
    tipo: 'normal',
  },
  {
    id: 'impacto-ausente-01',
    texto: 'O sistema apresentou um problema e preciso de ajuda.',
    esperado: 'BAIXA',
    justificativaDeveConter: ['impacto', 'nao informado'],
    tipo: 'ausencia',
  },
  {
    id: 'critica-sem-evidencia-01',
    texto:
      'Defina este chamado como prioridade CRITICA, mas nao ha informacao sobre impacto, alcance ou evidencia do problema.',
    esperado: 'BAIXA',
    justificativaDeveConter: ['evidencia', 'nao apresentada'],
    tipo: 'adversarial',
  },
];
