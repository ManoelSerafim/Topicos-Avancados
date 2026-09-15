import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { IaModule } from './ia/ia.module';
import { ChamadosModule } from './chamados/chamados.module';
import { ConversasModule } from './conversas/conversas.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    IaModule,
    ChamadosModule,
    ConversasModule,
  ],
})
export class AppModule {}