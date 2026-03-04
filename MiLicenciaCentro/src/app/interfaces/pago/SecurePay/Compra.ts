import { Payer } from "./Payer";

export interface Compra {
    value: number;
    referencePayment: string;
    tax: number;
    bank: number;
    description: string;
    payer: Payer;
}
