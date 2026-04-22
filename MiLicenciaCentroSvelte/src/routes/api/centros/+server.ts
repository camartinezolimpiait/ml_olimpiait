import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { getApiMilicencia } from '$lib/services/api-milicencia.util';

export const GET: RequestHandler = async ({ url, fetch }) => {
  const tipo = url.searchParams.get('tipo') ?? '1';

  try {
    const apiUrl = `${getApiMilicencia()}/servicios/CompraPin/ObtenerTodosCentros?tipo=${tipo}`;
    const response = await fetch(apiUrl, {
      headers: { 'Content-Type': 'application/json' }
    });

    if (!response.ok) {
      return json([], { status: 200 });
    }

    const data = await response.json();
    return json(data);
  } catch {
    return json([]);
  }
};
