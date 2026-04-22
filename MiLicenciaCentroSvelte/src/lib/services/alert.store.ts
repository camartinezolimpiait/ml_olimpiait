/**
 * Store para el estado de la alerta (snackbar/toast).
 * Equivalente al uso de MatSnackBar en Angular.
 */
import { writable } from 'svelte/store';

export interface AlertState {
  tipo: 'info' | 'success' | 'warning' | 'error';
  mensaje: string;
}

export const alertStore = writable<AlertState | null>(null);
