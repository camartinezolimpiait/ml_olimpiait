import { CostoCuota } from "../compraPin/CostoCuota";

/**
 * Valor de compra discriminado, incluyendo
 * la dispersión al SICOV, al banco, el centro y
 * el ANSV.
 */
export interface DiscriminadoValorPin {
  sicov: number;
  banco: number;
  crc: number;
  ansv: number;
  calculoCoutas : CostoCuota[];
  valorTotal: number;
}
