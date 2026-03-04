export interface RutaNavegacion {
    nombreEnlace: string
    ruta?: string
    descripcion?:string
    activoMovil?: boolean
    icono?:string
    subRutas?: RutaNavegacion[]
  }