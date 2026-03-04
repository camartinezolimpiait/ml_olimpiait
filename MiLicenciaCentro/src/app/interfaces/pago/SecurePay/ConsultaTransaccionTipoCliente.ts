import { TipoCliente } from "src/app/enums/PinesOlimpia/TipoCliente";
import { ConsultaTransaccionRequest } from "./ConsultaTransaccionRequest";

export interface ConsultaTransaccionTipoCliente {
    consultaTransaccion: ConsultaTransaccionRequest;
    tipoCliente: TipoCliente;
}