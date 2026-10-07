export const CHAMADO_PRIORIDADES = [
  'BAIXA',
  'MEDIA',
  'ALTA',
  'CRITICA',
] as const;

export type ChamadoPrioridade = (typeof CHAMADO_PRIORIDADES)[number];

export function isChamadoPrioridade(value: string): value is ChamadoPrioridade {
  return CHAMADO_PRIORIDADES.includes(value as ChamadoPrioridade);
}
