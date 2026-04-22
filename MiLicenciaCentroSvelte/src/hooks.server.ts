import type { Handle } from '@sveltejs/kit';
import { redirect } from '@sveltejs/kit';
import { createHmac, timingSafeEqual } from 'crypto';
import { SESSION_SECRET } from '$env/static/private';

/** Routes that require authentication */
const PROTECTED_ROUTES: Record<string, string[]> = {
  '/admin': ['Administrador', 'Director'],
  '/admin/reportes': ['Administrador', 'Director', 'Auditor'],
  '/admin/operaciones': ['Administrador', 'Instructor'],
};

/** Routes that are always public */
const PUBLIC_ROUTES = ['/', '/error', '/login', '/403'];

/**
 * Verifies the HMAC signature of the session cookie to prevent forgery.
 * Cookie format: base64(payload).hmac_hex
 */
function getUserFromCookies(cookies: { get: (name: string) => string | undefined }) {
  const sessionCookie = cookies.get('session');
  if (!sessionCookie) return null;

  try {
    const dotIndex = sessionCookie.lastIndexOf('.');
    if (dotIndex === -1) return null;

    const payloadB64 = sessionCookie.slice(0, dotIndex);
    const signature = sessionCookie.slice(dotIndex + 1);

    // Verify HMAC-SHA256 signature (timing-safe comparison)
    const expectedSig = createHmac('sha256', SESSION_SECRET).update(payloadB64).digest('hex');
    const sigBuffer = Buffer.from(signature, 'hex');
    const expectedBuffer = Buffer.from(expectedSig, 'hex');

    if (sigBuffer.length !== expectedBuffer.length) return null;
    if (!timingSafeEqual(sigBuffer, expectedBuffer)) return null;

    return JSON.parse(Buffer.from(payloadB64, 'base64').toString('utf-8'));
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
