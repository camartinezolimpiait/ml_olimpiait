/**
 * Store para el estado del diálogo modal.
 * Equivalente al uso de MatDialog en Angular.
 */
import { writable } from 'svelte/store';

export interface DialogState {
  titulo?: string;
  mensaje: string;
  textoConfirmar?: string;
  textoCancelar?: string;
  onConfirm?: () => void;
  onCancel?: () => void;
}

export const dialogStore = writable<DialogState | null>(null);

export function closeDialog(): void {
  dialogStore.set(null);
}
