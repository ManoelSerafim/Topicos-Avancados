import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ChamadosService } from './chamados.service';
import { ClassificarChamadoDto } from './dto/classificar-chamado.dto';


@Controller('chamados')
export class ChamadosController {
  constructor(private readonly chamadosService: ChamadosService) {}

  @Post('/classificar')
  create(@Body() classificarChamadoDto: ClassificarChamadoDto) {
    return this.chamadosService.classificar(classificarChamadoDto.texto);
  }
}
