export interface ConsultaEstadoDevolucion {
  idCliente: string;
  numeroIdentificacion: string;
  tipoIdentificacion: number;
  pinComprado: string;
  idOrigenCotizacion: number;
  idRunt: string|null;
}