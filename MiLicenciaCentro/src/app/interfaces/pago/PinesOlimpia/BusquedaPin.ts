import { TipoCliente } from './TipoCliente';

export interface BusquedaPin extends TipoCliente{
    fechaCompraPin: string,
    codigoRuntCentro: string,
    tipoIdentificacionUsuario: number,
    identificacionUsuario: string
  };
