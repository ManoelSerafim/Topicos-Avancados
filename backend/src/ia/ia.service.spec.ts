import { Test } from '@nestjs/testing';
import { IaService } from './ia.service';
import {
  MODELO_PROVIDER,
  ModeloProvider,
} from './providers/modelo.provider';

describe('IaService', () => {
  let service: IaService;
  let provider: jest.Mocked<ModeloProvider>;

  beforeEach(async () => {
    provider = {
      gerar: jest.fn(),
      gerarStream: jest.fn(),
      classificar: jest.fn(),
    };

    const moduleRef = await Test.createTestingModule({
      providers: [
        IaService,
        {
          provide: MODELO_PROVIDER,
          useValue: provider,
        },
      ],
    }).compile();

    service = moduleRef.get(IaService);
  });

  it('normaliza a mensagem e devolve o resultado do provider', async () => {
    provider.gerar.mockResolvedValue({
      resposta: 'Resposta simulada',
      modelo: 'modelo-de-teste',
      tokensEntrada: 10,
      tokensSaida: 4,
    });

    await expect(service.responder('  Olá  ')).resolves.toEqual({
      resposta: 'Resposta simulada',
      modelo: 'modelo-de-teste',
      tokensEntrada: 10,
      tokensSaida: 4,
    });

    expect(provider.gerar).toHaveBeenCalledWith({ mensagem: 'Olá' });
  });

  it('normaliza a mensagem antes de iniciar o streaming', () => {
    const signal = new AbortController().signal;
    const stream = service.gerarStream('  Olá  ', signal);

    expect(stream).toBe(provider.gerarStream.mock.results[0]?.value);
    expect(provider.gerarStream).toHaveBeenCalledWith({
      mensagem: 'Olá',
      signal,
    });
  });

  it('rejeita mensagem vazia no streaming', () => {
    expect(() => service.gerarStream('   ', new AbortController().signal)).toThrow(
      'A mensagem não pode conter apenas espaços',
    );
    expect(provider.gerarStream).not.toHaveBeenCalled();
  });
});