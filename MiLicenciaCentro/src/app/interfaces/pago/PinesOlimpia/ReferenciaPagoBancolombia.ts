import { Cuotas } from './Cuota';
import { TipoCliente } from './TipoCliente';

export interface ReferenciaPagoBancolombia extends TipoCliente
{
    referencia: InformacionPagoBancolombia;
    categoria1: string;
    categoria2: string;
    esCorresponsal?: number;
    idTramite:number;
    host:string;
    idDescripcionUserOTP?:number;
}

export interface InformacionPagoBancolombia
{
    apellidos: string;
    correoElectronico: string;
    dispersionAliado: number;
    dispersionAns: number;
    dispersionCrc: number;
    dispersionSicov: number;
    fechaNacimiento: string;
    idRunt: number;
    nombres: string;
    numeroIdentificacion: string;
    sexo: number;
    telefonoContacto: string;
    tipoIdentificacion: number;
    valorTransaccion: number;
    cuotas?: Cuotas[]
    valorPrimeraCuota?: number;
    idConvenio?: number;
    apellidosFacturacion?:string |null|'';
    correoFacturacion?:string |null|'';
    nombreComercialFacturacion?:string |null|'';
    nombresFacturacion?:string |null|'';
    numeroIdentificacionFacturacion?:string |null|'';
    razonSocialFacturacion?:string |null|'',
    tipoIdentificacionFacturacion?:number |null;
    tipoPersonaFacturacion?:number |null;
}
