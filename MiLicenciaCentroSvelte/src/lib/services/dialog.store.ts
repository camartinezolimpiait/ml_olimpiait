/**
 * Store para el estado del diálogo modal.
 * Equivalente al uso de MatDialog en Angular.
 */
import { writable } from 'svelte/store';

export interface DialogState {
  mensaje: string;
  logo: string;
  visible: boolean;
  confirmable: boolean;
  idBoton?: string;
}

export const dialogStore = writable<DialogState>({
  mensaje: '',
  logo: '',
  visible: false,
  confirmable: false
});

export function closeDialog(): void {
  dialogStore.update((state) => ({ ...state, visible: false }));
}
