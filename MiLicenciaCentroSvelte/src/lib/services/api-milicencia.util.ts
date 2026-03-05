/**
 * Utilidad para obtener la URL base de la API de MiLicencia
 * según el entorno activo.
 * Migrado desde Angular: src/app/services/util/api-milicencia.util.ts
 */
import { rutas } from '$lib/const/rutas';
import { environment } from '$lib/environments/environment';

/**
 * Devuelve la URL base de la API de MiLicencia para el setting actual.
 */
export function getApiMilicencia(): string {
  const setting = environment.setting as keyof typeof rutas.rutasInternas;
  return rutas.rutasInternas[setting]?.apiMilicencia ?? rutas.rutasInternas.Calidad.apiMilicencia;
}
