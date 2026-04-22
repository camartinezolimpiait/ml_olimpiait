import type { PageServerLoad, Actions } from './$types';
import { fail } from '@sveltejs/kit';
import { getApiMilicencia } from '$lib/services/api-milicencia.util';

export const load: PageServerLoad = async () => {
  return {};
};

export const actions: Actions = {
  consultar: async ({ request, fetch }) => {
    const formData = await request.formData();
    const tipoDocumento = formData.get('tipoDocumento')?.toString();
    const numeroDocumento = formData.get('numeroDocumento')?.toString()?.trim();

    if (!numeroDocumento) {
      return fail(400, {
        errors: { numeroDocumento: 'El número de documento es requerido' }
      });
    }

    try {
      const apiUrl = `${getApiMilicencia()}/servicios/CompraPin/ConsultarPin`;
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tipoDocumento, numeroDocumento })
      });

      if (!response.ok) {
        return fail(response.status, { error: 'No se pudo obtener la información. Intenta de nuevo.' });
      }

      const resultado = await response.json();
      return { resultado };
    } catch {
      return fail(500, { error: 'Error de conexión. Por favor intenta más tarde.' });
    }
  }
};
