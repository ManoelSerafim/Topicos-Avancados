import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import {
  MODELO_PROVIDER,
} from './providers/modelo.provider';
import type {
  GerarClassificaçãoChamadoOutput,
  GerarRespostaOutput,
  ModeloProvider,
} from './providers/modelo.provider';

@Injectable()
export class IaService {
  constructor(
    @Inject(MODELO_PROVIDER)
    private readonly modelo: ModeloProvider,
  ) {}

  responder(mensagem: string): Promise<GerarRespostaOutput> {
    const mensagemNormalizada = mensagem.trim();

    if (!mensagemNormalizada) {
      throw new BadRequestException('A mensagem não pode conter apenas espaços');
    }

    return this.modelo.gerar({ mensagem: mensagemNormalizada });
  }
  classificar(texto: string): Promise<GerarClassificaçãoChamadoOutput> {
    const mensagemNormalizada = texto.trim();

    if (!mensagemNormalizada) {
      throw new BadRequestException('A mensagem não pode conter apenas espaços');
    }

    return this.modelo.classificar({ texto: mensagemNormalizada });
  }
}