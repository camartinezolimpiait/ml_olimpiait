import { TipoCliente } from './TipoCliente';

export interface EnvioOtpAccionBancolombia extends TipoCliente{
    numeroIdentificacion: string,
    nuevoNumeroIdentificacion: string,
    nuevoTipoIdentificacion: number,
    tipoIdentificacion: number,
    pinComprado: string,
    operacionUsuarioBancolombia: number,
    preValidacion:boolean
}