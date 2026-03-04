import { ActualizarDevolucionTransferenciaRequest } from "./ActualizarDevolucionTransferenciaRequest";

export interface ActualizarDevolucionTransferencia
{
pin:string;
novedad:string;
usuarioReg:string;
informacionNueva:ActualizarDevolucionTransferenciaRequest;// informacion del banco nuevo
}