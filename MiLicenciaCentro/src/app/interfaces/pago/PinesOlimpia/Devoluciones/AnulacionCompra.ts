import { Transferencia } from './Transferencia';
import { TipoCliente } from '../TipoCliente';

export interface AnulacionCompra extends TipoCliente
{
    codigoConfirmacion: string;
    tipoDocumento: number;
    numeroDocumento: string;
    pinComprado: string;
    idProceso: number;
    transferencia: Transferencia | null;
    idMotivoDevolucion:number;
}
