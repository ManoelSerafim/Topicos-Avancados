export interface GerarRespostaInput {
  mensagem: string;
}

export interface GerarStreamInput {
  mensagem: string;
  signal?: AbortSignal;
}

export interface GerarRespostaOutput {
  resposta: string;
  modelo: string;
  tokensEntrada?: number;
  tokensSaida?: number;
}

export interface GerarClassificaçãoChamadoInput {
  texto: string;
}

export interface GerarClassificaçãoChamadoOutput {
  texto: string;
  categoria: string;
  modelo?: string;
}

export interface ModeloProvider {
  gerar(input: GerarRespostaInput): Promise<GerarRespostaOutput>;
  gerarStream(input: GerarStreamInput): AsyncIterable<string>;
  classificar(
    input: GerarClassificaçãoChamadoInput,
  ): Promise<GerarClassificaçãoChamadoOutput>;
}


export const MODELO_PROVIDER = Symbol('MODELO_PROVIDER');