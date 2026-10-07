import { Module } from '@nestjs/common';
import { ChamadosService } from './chamados.service';
import { ChamadosController } from './chamados.controller';
import { IaModule } from 'src/ia/ia.module';
import { AvaliadorClassificacaoService } from './avaliacao/avaliador-classificacao.service';

@Module({
  imports: [IaModule],
  controllers: [ChamadosController],
  providers: [ChamadosService, AvaliadorClassificacaoService],
  exports: [AvaliadorClassificacaoService],
})
export class ChamadosModule {}
