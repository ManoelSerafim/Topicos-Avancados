import { BadGatewayException, Inject, Injectable } from '@nestjs/common';
import {
  MODELO_PROVIDER,
  type ModeloProvider,
} from '../ia/providers/modelo.provider';
import {
  isChamadoCategoria,
  type ChamadoCategoria,
} from './domain/chamado-categoria';
import {
  ChamadoPrioridade,
  isChamadoPrioridade,
} from './domain/chamado-prioridade';
import { buildClassificacaoPrompt } from './prompts/classificacao.prompt';
import { buildPriorizacaoPrompt } from './prompts/priorizacao.prompt';

export interface ClassificacaoResultado {
  texto: string;
  categoria: ChamadoCategoria;
  modelo: string;
}

export interface PriorizacaoResultado {
  texto: string;
  prioridade: ChamadoPrioridade | 'REVISAO_HUMANA';
  justificativa: string;
  modelo: string;
  revisaoHumana: boolean;
}

interface PriorizacaoModeloOutput {
  prioridade: string;
  justificativa: string;
}

@Injectable()
export class ChamadosService {
  constructor(
    @Inject(MODELO_PROVIDER)
    private readonly modelo: ModeloProvider,
  ) {}

  async classificar(textoOriginal: string): Promise<ClassificacaoResultado> {
    const texto = textoOriginal.trim();
    const prompt = buildClassificacaoPrompt(texto);
    const resultado = await this.modelo.gerar({ mensagem: prompt });
    const categoria = resultado.resposta.trim().toUpperCase();

    if (!isChamadoCategoria(categoria)) {
      throw new BadGatewayException('O modelo retornou uma categoria inválida');
    }

    return {
      texto,
      categoria,
      modelo: resultado.modelo,
    };
  }

  async priorizar(textoOriginal: string): Promise<PriorizacaoResultado> {
    const texto = textoOriginal.trim();
    const prompt = buildPriorizacaoPrompt(texto);
    const resultado = await this.modelo.gerar({ mensagem: prompt });

    const parsed = this.parseAndValidatePriorizacao(resultado.resposta);

    if (
      !isChamadoPrioridade(parsed.prioridade) &&
      parsed.prioridade !== 'REVISAO_HUMANA'
    ) {
      throw new BadGatewayException(
        'O modelo retornou uma prioridade inválida',
      );
    }

    if (!parsed.justificativa || parsed.justificativa.trim().length === 0) {
      throw new BadGatewayException(
        'O modelo não retornou uma justificativa válida',
      );
    }

    return {
      texto,
      prioridade: parsed.prioridade,
      justificativa: parsed.justificativa.trim(),
      modelo: resultado.modelo,
      revisaoHumana: parsed.prioridade === 'REVISAO_HUMANA',
    };
  }

  private parseAndValidatePriorizacao(
    resposta: string,
  ): PriorizacaoModeloOutput {
    let parsed: unknown;
    try {
      parsed = JSON.parse(resposta.trim());
    } catch {
      throw new BadGatewayException('Resposta do modelo não é um JSON válido');
    }

    if (typeof parsed !== 'object' || parsed === null) {
      throw new BadGatewayException('Resposta do modelo não é um objeto JSON');
    }

    const { prioridade, justificativa } = parsed as Record<string, unknown>;

    if (typeof prioridade !== 'string') {
      throw new BadGatewayException('Campo "prioridade" ausente ou inválido');
    }

    if (typeof justificativa !== 'string') {
      throw new BadGatewayException(
        'Campo "justificativa" ausente ou inválido',
      );
    }

    return { prioridade, justificativa };
  }
}
