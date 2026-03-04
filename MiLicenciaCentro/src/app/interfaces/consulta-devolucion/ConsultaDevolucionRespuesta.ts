import { ConsultaDevolucion } from "./ConsultaDevolucion";

export interface ConsultaDevolucionRespuesta {
    ok: boolean,
    mensaje: string,
    data: ConsultaDevolucion[]
}