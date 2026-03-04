import { TipoDocumentoPtesaDTO } from "src/app/interfaces/cotizacion/TipoDocumentoPtesaDTO";

export interface FormularioDevolucion {
    formaDevolucion: string,
    operacionBancolombia: any,
    datosTransferencia: any,
    tiposDocumento: any,
    nombreBanco: string,
    confirmaOperacion: boolean,
    tipoTramite: boolean
}