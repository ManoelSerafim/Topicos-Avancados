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

  describe('classificar', () => {
    it('aceita uma categoria permitida', async () => {
      gerar.mockResolvedValue({
        resposta: ' acesso ',
        modelo: 'modelo-controlado',
      });

      await expect(
        service.classificar('Minha senha foi bloqueada.'),
      ).resolves.toMatchObject({ categoria: 'ACESSO' });
    });

    it('rejeita categoria inventada', async () => {
      gerar.mockResolvedValue({
        resposta: 'SUPORTE_TECNICO',
        modelo: 'modelo-controlado',
      });

      await expect(
        service.classificar('O computador está lento.'),
      ).rejects.toThrow('categoria inválida');
    });

    it('rejeita explicação junto da categoria', async () => {
      gerar.mockResolvedValue({
        resposta: 'ACESSO porque a senha expirou',
        modelo: 'modelo-controlado',
      });

      await expect(service.classificar('Minha senha expirou.')).rejects.toThrow(
        'categoria inválida',
      );
    });
  });

  describe('priorizar', () => {
    it('retorna prioridade ALTA com justificativa', async () => {
      gerar.mockResolvedValue({
        resposta: JSON.stringify({
          prioridade: 'ALTA',
          justificativa:
            'Usuário não consegue acessar sistema essencial para trabalho.',
        }),
        modelo: 'modelo-controlado',
      });

      const resultado = await service.priorizar(
        'Não consigo acessar o sistema de folha de pagamento para processar salários.',
      );

      expect(resultado.prioridade).toBe('ALTA');
      expect(resultado.justificativa).toContain('não consegue acessar');
      expect(resultado.revisaoHumana).toBe(false);
    });

    it('retorna prioridade CRITICA com justificativa', async () => {
      gerar.mockResolvedValue({
        resposta: JSON.stringify({
          prioridade: 'CRITICA',
          justificativa:
            'Sistema indisponível para todos os usuários da unidade.',
        }),
        modelo: 'modelo-controlado',
      });

      const resultado = await service.priorizar(
        'Sistema totalmente fora do ar para toda a empresa desde às 8h.',
      );

      expect(resultado.prioridade).toBe('CRITICA');
      expect(resultado.revisaoHumana).toBe(false);
    });

    it('retorna REVISAO_HUMANA quando impacto não está claro', async () => {
      gerar.mockResolvedValue({
        resposta: JSON.stringify({
          prioridade: 'REVISAO_HUMANA',
          justificativa:
            'O chamado não informa o alcance ou impacto do problema.',
        }),
        modelo: 'modelo-controlado',
      });

      const resultado = await service.priorizar(
        'Preciso de ajuda com uma coisa importante.',
      );

      expect(resultado.prioridade).toBe('REVISAO_HUMANA');
      expect(resultado.revisaoHumana).toBe(true);
    });

    it('rejeita prioridade inválida do modelo', async () => {
      gerar.mockResolvedValue({
        resposta: JSON.stringify({
          prioridade: 'URGENTE',
          justificativa: 'Muito urgente',
        }),
        modelo: 'modelo-controlado',
      });

      await expect(service.priorizar('Sistema fora do ar.')).rejects.toThrow(
        'prioridade inválida',
      );
    });

    it('rejeita resposta sem justificativa', async () => {
      gerar.mockResolvedValue({
        resposta: JSON.stringify({
          prioridade: 'ALTA',
          justificativa: '',
        }),
        modelo: 'modelo-controlado',
      });

      await expect(
        service.priorizar('Não consigo acessar o sistema.'),
      ).rejects.toThrow('justificativa válida');
    });

    it('rejeita resposta que não é JSON válido', async () => {
      gerar.mockResolvedValue({
        resposta: 'ALTA - Usuário impedido',
        modelo: 'modelo-controlado',
      });

      await expect(
        service.priorizar('Não consigo acessar o sistema.'),
      ).rejects.toThrow('JSON válido');
    });
  });
});
