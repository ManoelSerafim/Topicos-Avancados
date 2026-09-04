import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import type { GerarClassificaçãoChamadoOutput } from 'src/ia/providers/modelo.provider';
import { MODELO_PROVIDER } from 'src/ia/providers/modelo.provider';
import type { ModeloProvider } from 'src/ia/providers/modelo.provider';
@Injectable()
export class ChamadosService {
  constructor(
    @Inject(MODELO_PROVIDER)
    private readonly modelo: ModeloProvider,
  ) {}
  classificar(texto: string): Promise<GerarClassificaçãoChamadoOutput> {
    const mensagemNormalizada = texto.trim();

    if (!mensagemNormalizada) {
      throw new BadRequestException('A mensagem não pode conter apenas espaços');
    }

    return this.modelo.classificar({ texto: mensagemNormalizada });
  }
}