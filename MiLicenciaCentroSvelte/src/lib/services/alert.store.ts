/**
 * Store para el estado de la alerta (snackbar).
 * Equivalente al uso de MatSnackBar en Angular.
 */
import { writable } from 'svelte/store';

export interface AlertState {
  message: string;
  visible: boolean;
}

export const alertStore = writable<AlertState>({
  message: '',
  visible: false
});
