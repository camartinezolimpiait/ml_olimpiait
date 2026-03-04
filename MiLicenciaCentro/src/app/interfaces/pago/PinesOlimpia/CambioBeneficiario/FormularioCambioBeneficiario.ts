import { TipoDocumentoPtesaDTO } from "src/app/interfaces/cotizacion/TipoDocumentoPtesaDTO";

export interface FormularioCambioBeneficiario{
    operacionBancolombia: any,
    tiposDocumento: TipoDocumentoPtesaDTO[],
    confirmaOperacion: boolean,
    tipoTramite: boolean
}