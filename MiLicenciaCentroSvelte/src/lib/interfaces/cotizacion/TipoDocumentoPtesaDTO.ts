/**
 * DTO de tipo de documento para PTESA.
 * Migrado desde Angular: src/app/interfaces/cotizacion/TipoDocumentoPtesaDTO.ts
 */
export interface TipoDocumentoPtesaDTO {
  id: number;
  nombre: string;
  visualizarCRC: boolean;
  visualizarCEA: boolean;
  edadMinima?: number;
  edadMaxima?: number;
}
