/**
 * Tipo de cliente: CRC o CEA.
 * Migrado desde Angular: src/app/enums/PinesOlimpia/TipoCliente.ts
 */
export enum TipoCliente {
  CRC = 3,
  CEA = 8
}

export const DescripcionTipoCliente: { [id: number]: string } = {
  3: 'Examen médico',
  8: 'Curso de conducción'
};

export const DescripcionTipoClienteCentro: { [id: number]: string } = {
  3: 'CRC',
  8: 'CEA'
};
