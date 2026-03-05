/**
 * Store de utilidades generales (errores HTTP compartidos entre componentes).
 * Equivalente al UtilGeneralService de Angular.
 * Migrado desde Angular: src/app/services/data/util-general/utilGeneral.service.ts
 */
import { writable } from 'svelte/store';

export interface HttpErrorInfo {
  status: number;
  url: string;
  message: string;
}

/**
 * Subject de errores HTTP. Los componentes pueden suscribirse para reaccionar a errores.
 */
export const errorSubject = writable<HttpErrorInfo | null>(null);
