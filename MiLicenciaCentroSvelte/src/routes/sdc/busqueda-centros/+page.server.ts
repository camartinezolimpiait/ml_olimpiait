import type { PageServerLoad } from './$types';
import type { Centro } from '$lib/interfaces/cotizacion/Centro';

export const load: PageServerLoad = async ({ fetch }) => {
  try {
    const response = await fetch('/api/centros?tipo=1');
    if (response.ok) {
      const centros: Centro[] = await response.json();
      return { centros };
    }
  } catch {
    // ignore
  }
  return { centros: [] as Centro[] };
};
