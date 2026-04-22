import type { PageServerLoad } from './$types';
import { error } from '@sveltejs/kit';
import { getApiMilicencia } from '$lib/services/api-milicencia.util';
import type { Centro } from '$lib/interfaces/cotizacion/Centro';

export const load: PageServerLoad = async ({ params, fetch }) => {
  const { id } = params;

  try {
    const response = await fetch(
      `${getApiMilicencia()}/servicios/CompraPin/ObtenerCentro?id=${id}`
    );

    if (response.ok) {
      const centro: Centro = await response.json();
      return { centro };
    }
  } catch {
    // Graceful degradation: return empty centro
  }

  // Return a placeholder so the page can render with the ID
  return {
    centro: null as Centro | null,
    centroId: id
  };
};
