import { TipoCliente } from '../TipoCliente';

export interface CambioDocumento extends TipoCliente {
    codigoConfirmacion: string;
    actualTipoDocumento: number;
    actualNumeroDocumento: string;
    nuevoTipoDocumento: number;
    nuevoNumeroDocumento: string;
    pinComprado: string;
    idProceso: number;
}
