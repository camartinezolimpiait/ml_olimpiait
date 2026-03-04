export enum MetodosSecurePay {
    ObtenerBancos = "ObtenerBancos",
    ObtenerReferenciaPSE = "ObtenerReferenciaPSE",
    ObtenerInformacionTransaccion = "ObtenerInformacionTransaccion"
}

export enum EstadoSecurePay {
    Activo = 1,
    Inactivo = 2,
    Aprobado = 3,
    Rechazado = 4,
    Pendiente = 5,
    Fallido = 6,
    Finalizado = 7,
    Cancelado = 8
}