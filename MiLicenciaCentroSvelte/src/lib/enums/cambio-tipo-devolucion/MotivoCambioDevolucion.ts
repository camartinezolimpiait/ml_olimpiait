/**
 * Motivos para cambio de tipo de devolución.
 * Migrado desde Angular: src/app/enums/cambio-tipo-devolucion/MotivoCambioDevolucion.ts
 */
export enum MotivoCambioDevolucion {
  NoHayPuntoPago = 1,
  Practicidad = 2
}

export const DescripcionMotivoCambioDevolucion: { [id: number]: string } = {
  1: 'No hay punto físico de punto de pago',
  2: 'Practicidad'
};
