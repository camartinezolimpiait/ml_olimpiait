import { Moment } from 'moment';

export interface DatosPersonales{
    fechaNacimiento: string,
    municipio: string,
    crcs: number,
    departamento: string,
    categoriaPrincipal: string,
    categoriaSecundaria: string,
    sexoBiologico: number,
    tramiteLicencia: string,
    fechaDeNacimiento: Moment,
    edad: number,
    nombreCategoria1: string| undefined,
    nombreCategoria2: string | undefined,
    descripcionTramite:string
}