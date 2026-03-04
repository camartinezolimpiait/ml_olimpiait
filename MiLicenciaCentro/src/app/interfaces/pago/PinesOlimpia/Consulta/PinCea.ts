import { CuotaCea } from './CuotaCea';

export interface PinCea
{
    idCentro:string;
    categoria: string;
    idPtesaPin: number;
    pin: string;
    cuotas: CuotaCea[];
}
