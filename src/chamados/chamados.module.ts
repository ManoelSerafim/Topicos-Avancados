import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ChamadosService } from './chamados.service';
import { ChamadosController } from './chamados.controller';
import { MODELO_PROVIDER } from 'src/ia/providers/modelo.provider';
import { OllamaProvider } from 'src/ia/providers/ollama.provider';
import { IaModule } from 'src/ia/ia.module';

@Module({
  imports: [HttpModule],
  controllers: [ChamadosController, ],
  providers: [
    ChamadosService,
    {
      provide: MODELO_PROVIDER,
      useClass: OllamaProvider,
    },
  ],
})
export class ChamadosModule {}
