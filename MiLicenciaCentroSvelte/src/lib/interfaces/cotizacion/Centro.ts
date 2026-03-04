/**
 * Centro de reconocimiento de conductores (CRC) o Escuela de conducción (CEA).
 * Migrado desde Angular: src/app/interfaces/cotizacion/Centro.ts
 */
export interface Centro {
  id: number;
  nombre: string;
  municipio?: string;
  departamento?: string;
  direccion?: string;
  telefono?: string;
  codigoRunt?: string;
  categorias?: string[];
  latitud?: number;
  longitud?: number;
}
