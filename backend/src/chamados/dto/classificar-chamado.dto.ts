import { IsString, MinLength, MaxLength } from 'class-validator';

export class ClassificarChamadoDto {
    @IsString()
    @MinLength(10)
    @MaxLength(200)
    texto!: string;
}
