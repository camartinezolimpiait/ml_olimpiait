/**
 * Opciones de trámite (simple o combo).
 * Migrado desde Angular: src/app/enums/OpcionTramite.ts
 */
export enum OpcionTramite {
  simple = 1,
  Combo = 2
}

export const DescripcionOpcionTramite: { [id: number]: string } = {
  1: 'Un solo trámite',
  2: 'Carro y moto'
};
