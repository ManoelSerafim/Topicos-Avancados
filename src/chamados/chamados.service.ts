import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { IaService } from 'src/ia/ia.service';
@Injectable()
export class ChamadosService {
  constructor(private readonly iaService: IaService) {}
  classificar(texto: string) {
    return this.iaService.classificar(texto);
  }
}