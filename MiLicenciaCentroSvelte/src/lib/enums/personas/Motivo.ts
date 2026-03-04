/**
 * Motivos de solicitud PQRS.
 * Migrado desde Angular: src/app/enums/personas/Motivo.ts
 */
export enum MotivoSolicitud {
  portal = 1,
  pines = 2,
  crc = 3
}

export const DescripcionMotivoSolicitudPQR: { [id: number]: string } = {
  1: 'Funcionamiento del portal web',
  2: 'Compra y devolución de pin',
  3: 'Dirigidas al CRC (Centro de reconocimiento de conductores)'
};
