import { Injectable } from '@nestjs/common';
import { ChamadoCategoria } from '../chamado-categoria';
import { ChamadosService } from '../chamados.service';
import { CASOS_AVALIACAO, type CasoAvaliacao } from './casos-avaliacao';

interface ResultadoAvaliacao extends CasoAvaliacao {
  obtido: ChamadoCategoria | null;
  formatoValido: boolean;
  correto: boolean;
  duracaoMs: number;
  erro: string | null;
}

@Injectable()
export class AvaliadorClassificacaoService {
  constructor(private readonly chamados: ChamadosService) {}

  async executar() {
    const resultados: ResultadoAvaliacao[] = [];

    for (const caso of CASOS_AVALIACAO) {
      const inicio = performance.now();

      try {
        const resposta = await this.chamados.classificar(caso.texto);

        resultados.push({
          ...caso,
          obtido: resposta.categoria,
          formatoValido: true,
          correto: resposta.categoria === caso.esperado,
          duracaoMs: Math.round(performance.now() - inicio),
          erro: null,
        });
      } catch (error) {
        resultados.push({
          ...caso,
          obtido: null,
          formatoValido: false,
          correto: false,
          duracaoMs: Math.round(performance.now() - inicio),
          erro: error instanceof Error ? error.message : 'Erro desconhecido',
        });
      }
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