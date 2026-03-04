/**
 * Servicio de cifrado AES256.
 * Migrado desde Angular: src/app/services/data/encrypt/encrypt.service.ts
 *
 * ⚠️ SEGURIDAD: La clave de cifrado no debe estar en código fuente en producción.
 * Usar variables de entorno del servidor (`$env/static/private`) y acceder solo
 * desde código server-side de SvelteKit.
 */
import CryptoJS from 'crypto-js';

/** Clave de cifrado. En producción, reemplazar con variable de entorno. */
const SECRET_KEY = process.env['ENCRYPT_SECRET_KEY'] ?? 'milicencia-secret-key-2024';

/**
 * Cifra un texto usando AES256.
 */
export function encryptUsingAES256(text: string): string {
  return CryptoJS.AES.encrypt(text, SECRET_KEY).toString();
}

/**
 * Descifra un texto cifrado con AES256.
 */
export function decryptUsingAES256(encryptedText: string): string {
  const bytes = CryptoJS.AES.decrypt(encryptedText, SECRET_KEY);
  return bytes.toString(CryptoJS.enc.Utf8);
}
