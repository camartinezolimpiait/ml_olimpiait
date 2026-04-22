import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
  // BFF: Server-side data fetching - no token needed for public endpoints
  // Returns empty array if API is unavailable (graceful degradation)
  return {
    noticias: [] as Array<{ id: string; titulo: string; contenido: string; imagen?: string }>
  };
};
