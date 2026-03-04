
import { TipoCliente } from './TipoCliente';

export interface AutorizacionDaviplata extends TipoCliente
{
    fechaTransaccion: String;
    idConvenio: number;
    idRunt: string;
    numeroAutorizacion: number;
    numeroIdentificacion:string;
    numeroPin:string;
    tipoIdentificacion:number;
    valorTransaccion:number; 
}