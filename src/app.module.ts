import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { IaModule } from './ia/ia.module';
import { ChamadosModule } from './chamados/chamados.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    IaModule,
    ChamadosModule,
  ],
})
export class AppModule {}