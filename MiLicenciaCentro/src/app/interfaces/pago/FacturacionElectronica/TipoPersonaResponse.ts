export interface TipoPersonaResponse {
    solicitudExitosa: boolean;
    mensaje: string;
    datos:tipoPersona[];
    errores: any[];
}

export interface tipoPersona {
    codigo:number;
    nombre:string;
}