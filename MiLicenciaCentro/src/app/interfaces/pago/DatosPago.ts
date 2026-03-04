import { DatosPersonales } from './DatosPersonales';
import { Centro } from '@interfaces/cotizacion/Centro';
import { DiscriminadoValorPin } from '@interfaces/cotizacion/DiscriminadoValorPin';

export interface DatosPago{
    DatosPersonales: DatosPersonales,
    CentroSeleccionado: Centro,
    Valores: DiscriminadoValorPin
}