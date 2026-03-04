import { ActualizarDevolucionTransferenciaRequest } from "../devoluciones/ActualizarDevolucionTransferenciaRequest";

export interface CambiotipoDevolucion{
    informacionNueva: ActualizarDevolucionTransferenciaRequest;
    novedad:string;
    pin:string;
    tipoSolicitud:number;
    usuarioReg:string;
    numeroIdentificacionSolicitante:string;
    tipoIdentificacionSolicitante: number;
    idCliente: number;
  }
  