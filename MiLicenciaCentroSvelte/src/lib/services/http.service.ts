/**
 * Servicio HTTP con manejo de token, loader y errores.
 * Equivale a los interceptores HTTP de Angular:
 * - TokenInterceptor: añade JWT Bearer token
 * - LoaderInterceptor: muestra/oculta indicador de carga
 * - AppHttpInterceptor: maneja errores HTTP
 *
 * Migrado desde Angular: src/app/interceptors/
 */
import { getJwtToken, refreshToken } from '$lib/services/auth.service';
import { showLoader, hideLoader } from '$lib/services/loader.store';
import { errorSubject } from '$lib/services/util-general.store';
import type { LogMLFront } from '$lib/interfaces/Otros/LogMLFront';
import { getApiMilicencia } from '$lib/services/api-milicencia.util';
import { Rutas } from '$lib/enums/API/Rutas';
import { MetodosCotizador } from '$lib/enums/API/MetodosCotizador';

/** URLs en las que no se muestra el loader */
const SKIP_LOADER_URLS = ['/404'];

let activeRequests = 0;
let isRefreshing = false;
let pendingRequests: Array<(token: string | null) => void> = [];

/**
 * Añade el token JWT a los headers si la URL lo requiere.
 */
function buildHeaders(url: string, customHeaders?: HeadersInit): Headers {
  const headers = new Headers(customHeaders);
  headers.set('Content-Type', 'application/json');

  if (url.includes('servicios')) {
    const token = getJwtToken();
    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }
  }
  return headers;
}

/**
 * Determina si se debe mostrar el loader para esta URL.
 */
function shouldShowLoader(url: string): boolean {
  return !SKIP_LOADER_URLS.some((skipUrl) => new RegExp(skipUrl).test(url));
}

/**
 * Registra un error del frontend en el backend.
 */
async function logError(error: unknown, method: string): Promise<void> {
  try {
    const logData: LogMLFront = {
      Metodo: method,
      Mensaje: error instanceof Error ? error.message : String(error),
      MensajeCompleto: JSON.stringify(error)
    };
    const urlLog = `${getApiMilicencia()}${Rutas.ServiciosCotizador}${MetodosCotizador.Log}`;
    await fetch(urlLog, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(logData)
    });
  } catch {
    // Silently ignore log errors
  }
}

/**
 * Petición HTTP genérica con manejo de token, loader y errores.
 * Equivalente al HttpClient de Angular con los tres interceptores aplicados.
 */
export async function httpRequest<T>(
  url: string,
  options: RequestInit = {}
): Promise<T> {
  const displayLoader = shouldShowLoader(url);

  if (displayLoader) {
    if (activeRequests === 0) showLoader();
    activeRequests++;
  }

  try {
    const headers = buildHeaders(url, options.headers as HeadersInit);
    const response = await fetch(url, { ...options, headers });

    if (response.status === 401 && url.includes('servicios')) {
      // Manejo de token expirado (equivalente al TokenInterceptor)
      if (!isRefreshing) {
        isRefreshing = true;
        try {
          const newTokenData = await refreshToken();
          const newToken = newTokenData.tokenBearer;
          isRefreshing = false;
          pendingRequests.forEach((resolve) => resolve(newToken));
          pendingRequests = [];

          // Reintentar con el nuevo token
          headers.set('Authorization', `Bearer ${newToken}`);
          const retryResponse = await fetch(url, { ...options, headers });
          return retryResponse.json() as Promise<T>;
        } catch (refreshError) {
          isRefreshing = false;
          // Notify all pending requests of failure
          pendingRequests.forEach((reject) => reject(null));
          pendingRequests = [];
          throw refreshError;
        }
      } else {
        // Esperar al token renovado o fallo
        const newToken = await new Promise<string>((resolve, reject) => {
          pendingRequests.push((token) => {
            if (token) {
              resolve(token);
            } else {
              reject(new Error('Token refresh failed'));
            }
          });
        });
        headers.set('Authorization', `Bearer ${newToken}`);
        const retryResponse = await fetch(url, { ...options, headers });
        return retryResponse.json() as Promise<T>;
      }
    }

    if (!response.ok) {
      const error = new Error(`HTTP error! status: ${response.status}`);
      errorSubject.set({ status: response.status, url, message: error.message });
      if (!url.includes('servicios')) {
        await logError(error, 'Servicio Externo');
      }
      throw error;
    }

    return response.json() as Promise<T>;
  } catch (error) {
    errorSubject.set({ status: 0, url, message: String(error) });
    throw error;
  } finally {
    if (displayLoader) {
      activeRequests--;
      if (activeRequests === 0) hideLoader();
    }
  }
}

/**
 * Petición GET tipada.
 */
export function httpGet<T>(url: string): Promise<T> {
  return httpRequest<T>(url, { method: 'GET' });
}

/**
 * Petición POST tipada.
 */
export function httpPost<T>(url: string, body: unknown): Promise<T> {
  return httpRequest<T>(url, {
    method: 'POST',
    body: JSON.stringify(body)
  });
}
