/**
 * Respuesta de verificación reCAPTCHA.
 * Migrado desde Angular: src/app/interfaces/Otros/RespuestaRecaptcha.ts
 */
export interface RespuestaRecaptcha {
  success: boolean;
  score?: number;
  action?: string;
  challenge_ts?: string;
  hostname?: string;
}
