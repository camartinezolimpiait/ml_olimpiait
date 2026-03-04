export enum TipoPago {
  Efectivo = 1,
  PSE = 2,
  NequiWompi=14,
  BancolombiaWompi=13,
  TdCWompi=15,
  Daviplata=16
}

export enum EstadoSandboxWompi {
    APPROVED = 1,
    DECLINED = 2,
    ERROR = 3
}

export interface MedioPago {
    id: number,
    nombre: string
}

export const MediosPago: MedioPago[] = [
    {
        id: TipoPago.Efectivo,
        nombre: "Efectivo"
    },
    {
        id: TipoPago.PSE,
        nombre: "PSE"
    },
    {
        id: TipoPago.NequiWompi,
        nombre: "Nequi"
    },
    {
        id: TipoPago.BancolombiaWompi,
        nombre: "Bancolombia"
    },
    {
        id: TipoPago.TdCWompi,
        nombre: "Tarjeta de Credito"
    },
    {
        id: TipoPago.Daviplata,
        nombre: "Daviplata"
    }
]
