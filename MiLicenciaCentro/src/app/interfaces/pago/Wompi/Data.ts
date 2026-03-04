import { EstadoSandboxWompi } from "src/app/enums/PinesOlimpia/TipoPago";
import { Cuota } from "./Cuota";
import { TramiteWompi } from "./TramiteWompi";

export interface Data {
  AcceptanceToken: string;
  Apellidos: string;
  Categoria: string;
  CorreoElectronico: string;
  CostoExtraRecaudo: number;
  Cuotas: Cuota[];
  DispersionAliado: number;
  DispersionAns: number;
  DispersionCrc: number;
  DispersionSicov: number;
  EstadoWompi: EstadoSandboxWompi;
  FechaNacimiento: string;
  IdConvenio: number;
  IdOrigenCotizacion: number;
  IdRunt: string;
  Nombres: string;
  NumeroIdentificacion: string;
  Sexo: number;
  TelefonoContacto: string;
  TipoIdentificacion: number;
  Tramite: TramiteWompi;
  UrlRedireccion: string;
  ValorTransaccion: number;
  tipoIdentificacionComprador?:number| null,
  numeroIdentificacionComprador?:string| null | '',
  apellidosFacturacion?:string |null|'',
  correoFacturacion?:string |null|'',
  nombreComercialFacturacion?:string |null|'',
  nombresFacturacion?:string |null|'',
  numeroIdentificacionFacturacion?:string |null|'',
  razonSocialFacturacion?:string |null|'',
  tipoIdentificacionFacturacion?:number |null,
  tipoPersonaFacturacion?:number |null,
  
}
