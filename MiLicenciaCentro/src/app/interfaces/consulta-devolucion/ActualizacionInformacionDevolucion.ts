import { Transferencia } from "../pago/PinesOlimpia/Devoluciones/Transferencia";
import { TipoCliente } from "../pago/PinesOlimpia/TipoCliente"
import { ConsultaDevolucionRequest } from "./ConsultaDevolucionRequest";

export interface ActualizacionInformacionDevolucion extends TipoCliente {
    transferencia: Transferencia,
    consultaDevolucion: ConsultaDevolucionRequest,
    pinComprado: string,
    auditoria: string,
    codigoOtp: string,
}