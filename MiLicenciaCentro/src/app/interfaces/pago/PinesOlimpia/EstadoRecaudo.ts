import { TipoCliente } from './TipoCliente';

export interface EstadoRecaudo extends TipoCliente{
    valorTransaccion: number,
    referenciaComercio: number,
    referenciaMedio: string,
    formDataRespuesta: string,
    codigoEstado: number,
    nombreEstado: string,
    canalUso: number
  };