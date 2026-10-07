import { Test } from '@nestjs/testing';
import { MODELO_PROVIDER } from '../../../src/ia/providers/modelo.provider';
import { ChamadosService } from '../../../src/chamados/chamados.service';

describe('ChamadosService', () => {
  const gerar = jest.fn();
  let service: ChamadosService;

  beforeEach(async () => {
    gerar.mockReset();

    const moduleRef = await Test.createTestingModule({
      providers: [
        ChamadosService,
        {
          provide: MODELO_PROVIDER,
          useValue: { gerar },
        },
      ],
    }).compile();

    service = moduleRef.get(ChamadosService);
  });

  it('aceita uma categoria permitida', async () => {
    gerar
      .mockResolvedValueOnce({
        resposta: ' MEDIA ',
        modelo: 'modelo-controlado',
      }) // prioridade
      .mockResolvedValueOnce({
        resposta: ' acesso ',
        modelo: 'modelo-controlado',
      }) // categoria
      .mockResolvedValueOnce({
        resposta: 'Justificativa válida',
        modelo: 'modelo-controlado',
      }); // justificativa

    await expect(
      service.classificar('Minha senha foi bloqueada.'),
    ).resolves.toMatchObject({ categoria: 'ACESSO', prioridade: 'MEDIA' });
  });

  it('rejeita categoria inventada', async () => {
    gerar
      .mockResolvedValueOnce({
        resposta: ' MEDIA ',
        modelo: 'modelo-controlado',
      })
      .mockResolvedValueOnce({
        resposta: 'SUPORTE_TECNICO',
        modelo: 'modelo-controlado',
      })
      .mockResolvedValueOnce({
        resposta: 'Justificativa',
        modelo: 'modelo-controlado',
      });

    await expect(
      service.classificar('O computador está lento.'),
    ).rejects.toThrow('categoria inválida');
  });

  it('rejeita explicação junto da categoria', async () => {
    gerar
      .mockResolvedValueOnce({
        resposta: ' MEDIA ',
        modelo: 'modelo-controlado',
      })
      .mockResolvedValueOnce({
        resposta: 'ACESSO porque a senha expirou',
        modelo: 'modelo-controlado',
      })
      .mockResolvedValueOnce({
        resposta: 'Justificativa',
        modelo: 'modelo-controlado',
      });

    await expect(service.classificar('Minha senha expirou.')).rejects.toThrow(
      'categoria inválida',
    );
  });
});
