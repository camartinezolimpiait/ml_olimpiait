export interface ActualizarDevolucionTransferenciaRequest
{
    idDevolucion:number;
    idTipoIdentificacionDevolucion:number;
    numeroIdentificacionDevolucion:string;
    idBancoDevolucion:number;
    idTipoCuentaDevolucion:number;
    numeroCuentaDevolucion:string;
    idMotivoDevolucion:number;
}