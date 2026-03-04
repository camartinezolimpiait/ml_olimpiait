/**
 * Servicio de cifrado AES256.
 * Migrado desde Angular: src/app/services/data/encrypt/encrypt.service.ts
 */
import CryptoJS from 'crypto-js';

const SECRET_KEY = 'milicencia-secret-key-2024';

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
