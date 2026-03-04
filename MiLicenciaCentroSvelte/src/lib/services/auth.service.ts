/**
 * Servicio de autenticación.
 * Maneja el token JWT y su renovación.
 * Migrado desde Angular: src/app/services/data/auth/auth.service.ts
 *
 * En Svelte no hay inyección de dependencias (DI), los servicios
 * son módulos TypeScript con funciones exportadas.
 */
import type { AuthRequest } from '$lib/interfaces/auth/AuthRequest';
import type { AuthResponse } from '$lib/interfaces/auth/AuthResponse';
import { environment } from '$lib/environments/environment';
import { getApiMilicencia } from '$lib/services/api-milicencia.util';
import { encryptUsingAES256 } from '$lib/services/encrypt.service';

const JWT_TOKEN = '_access';
const urlServices = `${getApiMilicencia()}/servicios/global/`;

/**
 * Obtiene el token JWT almacenado en localStorage.
 */
export function getJwtToken(): string | null {
  if (typeof localStorage === 'undefined') return null;
  return localStorage.getItem(JWT_TOKEN);
}

/**
 * Almacena el token JWT en localStorage.
 */
function storeJwtToken(jwt: string): void {
  if (typeof localStorage !== 'undefined') {
    localStorage.setItem(JWT_TOKEN, jwt);
  }
}

/**
 * Realiza la petición de renovación de token al backend.
 * Equivale al método refreshToken() del AuthService de Angular.
 */
export async function refreshToken(): Promise<AuthResponse> {
  const payload = JSON.stringify({
    UserName: environment.apiAuth.UserName,
    UserPassword: environment.apiAuth.UserPassword,
    Key: Date.now()
  });

  const request: AuthRequest = {
    key: encryptUsingAES256(payload)
  };

  const response = await fetch(`${urlServices}Autenticate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(request)
  });

  if (!response.ok) {
    throw new Error(`Error al autenticar: ${response.status}`);
  }

  const tokens: AuthResponse = await response.json();
  storeJwtToken(tokens.tokenBearer);
  return tokens;
}
