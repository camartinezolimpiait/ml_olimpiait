/**
 * Configuración del entorno de desarrollo.
 * Migrado desde Angular: src/environments/environment.ts
 *
 * ⚠️ SEGURIDAD: En SvelteKit, los valores sensibles (UserName, UserPassword)
 * deben moverse a variables de entorno del servidor usando `$env/static/private`
 * o `$env/dynamic/private`. Los valores aquí expuestos son los mismos del
 * proyecto Angular original y se mantienen por compatibilidad de migración.
 * Para producción, usar variables de entorno .env:
 *   API_AUTH_USER=...
 *   API_AUTH_PASSWORD=...
 */
export const environment = {
  serverUrl: 'http://localhost:53618/',
  production: false,
  routingPrefix: '',
  outputPath: '',
  setting: 'Calidad',
  recaptcha: {
    siteKey: '6Ldh-yUhAAAAAJ_Bc4FseTL8osPdpXxVAAUiI_p1',
    IsRecaptchaActive: true
  },
  apiAuth: {
    UserName: '087b3088-683f-426a-8e01-a2d7425c840e',
    UserPassword: '=KEC+HM4vONcyy'
  }
};
