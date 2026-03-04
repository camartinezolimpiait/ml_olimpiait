export interface ConsultaDevolucion {
    pin: string,
    tipoNegocio: string,
    centro: string,
    fechaDeSolicitud: string,
    estado: string,
    fechaDevolucion: string,
    tipoDevolucion: string,
    observacion: string,
    origenRecaudo: string,
    origenRegistro: string,
    permitirIntento: boolean
}