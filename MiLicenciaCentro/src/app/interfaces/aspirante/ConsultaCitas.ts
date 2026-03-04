import { ConsultaBase } from 'src/app/interfaces/comun/ConsultaBase';

export interface ConsultaCitas extends ConsultaBase {
    captchaToken: string
}
