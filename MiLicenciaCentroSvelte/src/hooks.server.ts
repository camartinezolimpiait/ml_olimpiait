import type { Handle } from '@sveltejs/kit';
import { redirect } from '@sveltejs/kit';

/** Routes that require authentication */
const PROTECTED_ROUTES: Record<string, string[]> = {
  '/admin': ['Administrador', 'Director'],
  '/admin/reportes': ['Administrador', 'Director', 'Auditor'],
  '/admin/operaciones': ['Administrador', 'Instructor'],
};

/** Routes that are always public */
const PUBLIC_ROUTES = ['/', '/error', '/login', '/403'];

function getUserFromCookies(cookies: { get: (name: string) => string | undefined }) {
  const sessionCookie = cookies.get('session');
  if (!sessionCookie) return null;
  try {
    return JSON.parse(Buffer.from(sessionCookie, 'base64').toString('utf-8'));
  } catch {
    return null;
  }
}

export const handle: Handle = async ({ event, resolve }) => {
  const pathname = event.url.pathname;

  // Attach user to locals from session cookie
  event.locals.user = getUserFromCookies(event.cookies);

  // Check if route is protected
  const protectedRoles = Object.entries(PROTECTED_ROUTES).find(([route]) =>
    pathname.startsWith(route)
  );

  if (protectedRoles) {
    const [, requiredRoles] = protectedRoles;
    const user = event.locals.user;

    if (!user) {
      throw redirect(302, `/login?returnTo=${encodeURIComponent(pathname)}`);
    }

    if (!requiredRoles.includes(user.rol)) {
      throw redirect(302, '/403');
    }
  }

  return resolve(event);
};
