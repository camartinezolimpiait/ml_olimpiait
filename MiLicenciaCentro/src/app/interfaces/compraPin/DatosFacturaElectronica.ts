import { DatosBasicos } from "./DatosBasicos";

export interface DatosFacturaElectronica extends DatosBasicos {
    nit: string | null,
    razonSocial: string | null,
    nombreComercial: string | null,
    tipoPersona:number | null
}