export interface Centro {
    idCentro: number;
    nombre: string;
    idComercio: number;
    idDepartamento: number;
    idMunicipio: number;
    idzona?: number;
    direccion: string;
    email: string;
    fijo: string;
    movil: string;
    latitud: number;
    longitud: number;
    codigoRUNT: number;
    distancia?: number;
    categorias?:string[] | undefined | null;
    busqueda :string;
  }