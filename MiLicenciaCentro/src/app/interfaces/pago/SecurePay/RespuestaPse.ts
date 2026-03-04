import { RespuestaPasarela } from './RespuestaPasarela';
import { TransactionResponse } from './TransactionResponse';

export interface RespuestaPse extends RespuestaPasarela {
    transactionResponse: TransactionResponse;
}

