import type { PageServerLoad } from './$types';
import type { Centro } from '$lib/interfaces/cotizacion/Centro';

export const load: PageServerLoad = async ({ fetch, url }) => {
  const tipo = url.searchParams.get('tipo') ?? '1';

  try {
    const response = await fetch(`/api/centros?tipo=${tipo}`);
    if (response.ok) {
      const centros: Centro[] = await response.json();
      return { centros };
    }
  } catch {
    // Graceful degradation
  }

  return { centros: [] as Centro[] };
};
