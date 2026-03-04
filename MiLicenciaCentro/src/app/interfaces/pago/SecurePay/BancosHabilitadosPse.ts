import { Banco } from './Banco';
import { RespuestaPasarela } from './RespuestaPasarela';

export interface BancosHabilitadosPse extends RespuestaPasarela {
    banks: Banco[];
}
