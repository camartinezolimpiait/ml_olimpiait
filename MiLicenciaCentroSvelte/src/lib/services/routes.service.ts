/**
 * Servicio de rutas - construcción de URLs de navegación y petición.
 * Migrado desde Angular: src/app/services/routes/routes.service.ts
 */
import { environment } from '$lib/environments/environment';

const routingPrefix = environment.routingPrefix;

/**
 * Construye una URL para petición HTTP.
 * @param server URL base del servidor
 * @param segments Segmentos de la URL
 */
export function getRequestURL(server: string, ...segments: string[]): string {
  let url = '';
  segments.forEach((s) => (url += '/' + s));
  return server + url;
}

/**
 * Construye una URL de navegación interna (child route).
 * @param segments Segmentos de la ruta
 */
export function getChildNavigationURL(...segments: string[]): string {
  let url = '';
  segments.forEach((s) => (url += s + '/'));
  return url;
}

/**
 * Construye una URL de navegación interna absoluta.
 * @param segments Segmentos de la ruta
 */
export function getAbsoluteNavigationURL(...segments: string[]): string {
  let url = routingPrefix;
  segments.forEach((s) => (url += s + '/'));
  return url;
}
