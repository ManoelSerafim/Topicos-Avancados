import {
  BadGatewayException,
  Inject,
  Injectable,
} from '@nestjs/common';
import {
  MODELO_PROVIDER,
  type ModeloProvider,
} from '../ia/providers/modelo.provider';
import {
  isChamadoCategoria,
  type ChamadoCategoria,
} from './chamado-categoria';
import { buildClassificacaoPrompt } from './classificacao.prompt';
import { ChamadoPrioridade, isChamadoPrioridade } from './chamado-prioridade';
import { buildPrioridadePrompt } from './prioridade.prompt';
import { buildJustificativaPrioridadePrompt } from './justificativa.prompt';

export interface ClassificacaoResultado {
  texto: string;
  categoria: ChamadoCategoria;
  prioridade: ChamadoPrioridade;
  justificativa: string;
  modelo: string;
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
    const promptPrioridade = buildPrioridadePrompt(texto);
    const resultadoPrioridade = await this.modelo.gerar({ mensagem: promptPrioridade });
    const resultado = await this.modelo.gerar({ mensagem: prompt });
    const categoria = resultado.resposta.trim().toUpperCase();
    const prioridade = resultadoPrioridade.resposta.trim().toUpperCase() as ChamadoPrioridade;
    const promptjustificativa = buildJustificativaPrioridadePrompt(texto, prioridade);
    const resultadoJustificativa = await this.modelo.gerar({ mensagem: promptjustificativa });
    const justificativa = resultadoJustificativa.resposta.trim();

    if (!isChamadoCategoria(categoria)) {
      throw new BadGatewayException(
        'O modelo retornou uma categoria inválida',
      );
    }
    if (!isChamadoPrioridade(prioridade)) {
      throw new BadGatewayException(
        'O modelo retornou uma prioridade inválida',
      );
    }
    if (!justificativa || justificativa.length === 0) {
      throw new BadGatewayException(
        'O modelo não retornou uma justificativa válida',
      );
    }
    return {
      texto,
      categoria,
      prioridade: prioridade,
      justificativa: justificativa,
      modelo: resultado.modelo,
    };
  }
}