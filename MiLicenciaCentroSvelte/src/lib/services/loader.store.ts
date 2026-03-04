/**
 * Store de carga (loading) global.
 * Migración del LoaderService de Angular al patrón de Svelte stores.
 * En Angular se usaba un Subject<boolean>, aquí usamos un writable store.
 *
 * Migrado desde Angular: src/app/services/loader/loader.service.ts
 */
import { writable } from 'svelte/store';

/**
 * Store que indica si hay una carga en progreso.
 */
export const isLoading = writable<boolean>(false);

/**
 * Muestra el indicador de carga.
 */
export function showLoader(): void {
  isLoading.set(true);
}

/**
 * Oculta el indicador de carga.
 */
export function hideLoader(): void {
  isLoading.set(false);
}
