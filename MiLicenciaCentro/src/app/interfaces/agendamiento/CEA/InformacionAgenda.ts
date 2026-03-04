export interface InformacionAgenda {
    idAgenda: number;
    idTipoIdentificacion: string;
    numeroDocumento: string;
    estudianteNombre: string;
    instructorNombre: string;
    centroNombre: string;
    fechaProgramada: Date | string;
    horaInicio: string;
    horaFin: string;
    tipoClase: string;
}