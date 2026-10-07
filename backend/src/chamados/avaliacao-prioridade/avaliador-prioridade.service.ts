import { Injectable } from '@nestjs/common';
import {
  isChamadoPrioridade,
  type ChamadoPrioridade,
} from '../domain/chamado-prioridade';
import { ChamadosService } from '../chamados.service';
import {
  CASOS_AVALIACAO_PRIORIDADE,
  type CasoAvaliacaoPrioridade,
} from './prioridade-avaliacao';

interface ResultadoAvaliacaoPrioridade extends CasoAvaliacaoPrioridade {
  obtido: ChamadoPrioridade | 'REVISAO_HUMANA' | null;
  justificativaObtida: string | null;
  justificativaValida: boolean;
  formatoValido: boolean;
  correto: boolean;
  duracaoMs: number;
  erro: string | null;
}

@Injectable()
export class AvaliadorPrioridadeService {
  constructor(private readonly chamados: ChamadosService) {}

  async executar() {
    const resultados: ResultadoAvaliacaoPrioridade[] = [];

    for (const caso of CASOS_AVALIACAO_PRIORIDADE) {
      const inicio = performance.now();

      try {
        const resposta = await this.chamados.priorizar(caso.texto);
        const justificativaNormalizada = normalizar(resposta.justificativa);
        const justificativaValida = caso.justificativaDeveConter.every(
          (evidencia) =>
            justificativaNormalizada.includes(normalizar(evidencia)),
        );
        const prioridadeValida = isChamadoPrioridade(resposta.prioridade);

        resultados.push({
          ...caso,
          obtido: resposta.prioridade,
          justificativaObtida: resposta.justificativa,
          justificativaValida,
          formatoValido: prioridadeValida && justificativaValida,
          correto: resposta.prioridade === caso.esperado && justificativaValida,
          duracaoMs: Math.round(performance.now() - inicio),
          erro: null,
        });
      } catch (error) {
        resultados.push({
          ...caso,
          obtido: null,
          justificativaObtida: null,
          justificativaValida: false,
          formatoValido: false,
          correto: false,
          duracaoMs: Math.round(performance.now() - inicio),
          erro: error instanceof Error ? error.message : 'Erro desconhecido',
        });
      }
    }

    function normalizar(valor: string): string {
      return valor
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .toLowerCase();
    }

    const total = resultados.length;
    const corretos = resultados.filter((item) => item.correto).length;
    const formatosValidos = resultados.filter(
      (item) => item.formatoValido,
    ).length;

    return {
      modelo: process.env.OLLAMA_MODEL ?? 'não informado',
      total,
      acuracia: corretos / total,
      conformidadeFormato: formatosValidos / total,
      resultados,
    };
  }
}
