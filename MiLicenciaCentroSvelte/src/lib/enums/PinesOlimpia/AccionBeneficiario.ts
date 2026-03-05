/**
 * Acciones de beneficiario disponibles en Bancolombia.
 * Migrado desde Angular: src/app/enums/PinesOlimpia/AccionBeneficiario.ts
 */
export enum AccionBeneficiario {
  Anulacion = 1,
  CambioDocumento = 2,
  Agendamiento = 3
}

export const DescripcionSolicitudOperacionBancolombia: { [id: number]: string } = {
  1: 'Anulación de compra y devolución de dinero',
  2: 'Cambio de documento de comprador',
  3: 'Proceso de agendamiento de citas'
};
