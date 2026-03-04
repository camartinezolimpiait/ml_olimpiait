export interface ReporteDetallado2 {
    cus: string;
    comercio: string;
    conceptoPago: string;
    email: string;
    estado: string;
    fecha: Date | string;
    iP: string;
    idPago: number;
    idTransaccion: number;
    medioPago: string;
    motivo: string;
    nombreBanco: string;
    numeroAprobacion: string;
    numeroDocumento: string;
    numeroTarjeta: string;
    referenciaAdicional1: string;
    referenciaAdicional2: string;
    referenciaAdicional3: string;
    referenciaAdicional4: string;
    referenciaPago: string;
    tramaEnvio: string;
    valorTotal: number;
    documentoTitular: string;
}

export interface ReporteDetallado1 {
    reporteDetallado: ReporteDetallado2[];
}

export interface ConsultaTransaccionResponse {
    code: string;
    message: string;
    reporteDetallado: ReporteDetallado1;
}