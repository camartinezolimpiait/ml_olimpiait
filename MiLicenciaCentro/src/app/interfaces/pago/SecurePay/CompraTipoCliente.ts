import { TipoCliente } from "src/app/enums/PinesOlimpia/TipoCliente";
import { Compra } from "./Compra";

export interface CompraTipoCliente {
    compra: Compra;
    tipoCliente: TipoCliente;
 }