import { Centro } from "../../interfaces/cotizacion/Centro";

export interface currentDataIp
{
    ip: string;
    fecha: Date;
    urlCentro: string;
    estadoIp: boolean;
    centroSeleccionado: Centro | undefined | null;
    tipoCliente: number | undefined | null;
}