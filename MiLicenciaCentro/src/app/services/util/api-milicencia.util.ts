import { environment } from 'src/environments/environment';
import { rutas } from 'src/app/const/rutas';

export function getApiMilicencia(): string {
  const setting = environment.setting || 'Local';
  const grupo = rutas.rutasInternas[setting as keyof typeof rutas.rutasInternas];
  if (grupo && grupo.apiMilicencia) {
    return grupo.apiMilicencia;
  }
  // Valor por defecto si no existe el grupo
  return rutas.rutasInternas['Local'].apiMilicencia;
}

export function getUrlPortalAdminCentro(): string {
  const setting = environment.setting || 'Local';
  const grupo = rutas.rutasInternas[setting as keyof typeof rutas.rutasInternas];
  if (grupo && grupo.urlPortalAdminCentro) {
    return grupo.urlPortalAdminCentro;
  }
  // Valor por defecto si no existe el grupo
  return rutas.rutasInternas['Local'].urlPortalAdminCentro;
}

export function getUrlResumen(): string {
  const setting = environment.setting || 'Local';
  const grupo = rutas.rutasInternas[setting as keyof typeof rutas.rutasInternas];
  if (grupo && grupo.urlResumen) {
    return grupo.urlResumen;
  }
  // Valor por defecto si no existe el grupo
  return rutas.rutasInternas['Local'].urlResumen;
}
