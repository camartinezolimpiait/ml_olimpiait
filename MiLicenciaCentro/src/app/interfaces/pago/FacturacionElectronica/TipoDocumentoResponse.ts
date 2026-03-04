export interface TipoDocumentoResponse {
  codigo: number;
  respuesta: string;
  numeroAuditoria: string;
  entidad: tipoDocumento[];
}
export interface tipoDocumento {
  idTipoSisec: string;
  nombre: string;
  tipoDocRunt: string;
  visualizarCrc: number;
  visualizarCea: number;
  edadMinima: number;
  edadMaxima: number;
  codigoACH: string;
  idTipoBancolombia: string;
  tipoDocDaviplata: string;
  tipoDocColpatria: string;
  visualizarFacturacionElectronica:boolean;
}