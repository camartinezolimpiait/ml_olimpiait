import type { PageServerLoad, Actions } from './$types';
import { fail } from '@sveltejs/kit';
import { getApiMilicencia } from '$lib/services/api-milicencia.util';

export const load: PageServerLoad = async () => {
  return {};
};

export const actions: Actions = {
  buscar: async ({ request, fetch }) => {
    const formData = await request.formData();
    const numeroPin = formData.get('numeroPin')?.toString()?.trim();
    const tipoDocumento = formData.get('tipoDocumento')?.toString();
    const numeroDocumento = formData.get('numeroDocumento')?.toString()?.trim();

    if (!numeroPin || !numeroDocumento) {
      return fail(400, {
        errors: {
          numeroPin: !numeroPin ? 'El número de PIN es requerido' : '',
          numeroDocumento: !numeroDocumento ? 'El número de documento es requerido' : ''
        }
      });
    }

    try {
      const response = await fetch(`${getApiMilicencia()}/servicios/CompraPin/ConsultarCambioBeneficiario`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ numeroPin, tipoDocumento, numeroDocumento })
      });

      if (!response.ok) {
        return fail(response.status, { error: 'No se pudo obtener la información.' });
      }

      const resultado = await response.json();
      return { resultado };
    } catch {
      return fail(500, { error: 'Error de conexión.' });
    }
  }
};
