/**
 * Servicio de utilidades generales.
 * Proporciona validaciones, formateo y helpers de UI.
 * Migrado desde Angular: src/app/services/util/util.service.ts
 */
import { TipoDocumento } from '$lib/enums/TipoDocumento';
import { dialogStore } from '$lib/services/dialog.store';
import { alertStore } from '$lib/services/alert.store';

/** Tipos de documento que solo contienen números */
export const tiposDeDocumentoNumericos: number[] = [
  TipoDocumento.CedulaCiudadania,
  TipoDocumento.TarjetaIdentidad,
  TipoDocumento.NIT
];

/**
 * Abre un diálogo modal con un mensaje e ícono.
 */
export function abrirDialogo(mensaje: string, logo: string): void {
  dialogStore.set({ mensaje, logo, visible: true, confirmable: false });
}

/**
 * Abre un diálogo modal de confirmación.
 */
export function abrirDialogoConfirmacion(mensaje: string, logo: string): void {
  dialogStore.set({ mensaje, logo, visible: true, confirmable: true });
}

/**
 * Muestra una alerta tipo snackbar.
 */
export function abrirAlerta(message: string): void {
  alertStore.set({ message, visible: true });
  setTimeout(() => alertStore.set({ message: '', visible: false }), 10000);
}

/**
 * Quita el enmascaramiento del valor del campo solicitado.
 */
export function desenmascararValor(
  val: string,
  docSelected: number,
  isPhone?: boolean
): string {
  const asegurarTipoNumerico = +docSelected;
  if (tiposDeDocumentoNumericos.includes(asegurarTipoNumerico) || isPhone) {
    const tmp = val.replace(' ', '').split('-');
    if (asegurarTipoNumerico === 4 && tmp.length > 1) {
      return tmp[0].replace(/\D+/g, '') + '-' + tmp[1].replace(/\D+/g, '');
    }
    return val.replace(/\D+/g, '');
  }
  return val.replace(/[^0-9a-zA-Z]/g, '');
}

/**
 * Devuelve el patrón de validación y longitud mínima según el tipo de documento.
 */
export function getDocumentValidation(tipoDoc: number): {
  pattern: string;
  minChars: number;
  mensaje: string;
} {
  switch (Number(tipoDoc)) {
    case TipoDocumento.CedulaCiudadania:
    case TipoDocumento.CedulaExtranjeria:
      return {
        pattern: '^([0-9]{1,10})$',
        minChars: 6,
        mensaje: 'Se aceptan solamente números de hasta 10 dígitos'
      };
    case TipoDocumento.Pasaporte:
      return {
        pattern: '^([0-9a-zA-Z]{1,24})$',
        minChars: 6,
        mensaje: 'El pasaporte debe tener hasta 24 caracteres'
      };
    case TipoDocumento.TarjetaIdentidad:
    case TipoDocumento.RegistroCivil:
    case TipoDocumento.NUIP:
      return {
        pattern: '^([0-9]{1,10})$',
        minChars: 10,
        mensaje: 'Se aceptan solamente números de hasta 10 dígitos'
      };
    case TipoDocumento.PermisoProteccionTemporal:
      return {
        pattern: '^([0-9]{1,7})$',
        minChars: 6,
        mensaje: 'Se aceptan solamente números de hasta 7 dígitos'
      };
    case TipoDocumento.PermisoEspecialPermanencia:
      return {
        pattern: '^([0-9]{1,15})$',
        minChars: 15,
        mensaje: 'Se aceptan solamente números de hasta 15 dígitos'
      };
    case TipoDocumento.NIT:
      return {
        pattern: '^([0-9]{9,15})$',
        minChars: 9,
        mensaje: 'Se aceptan solamente números de 9 hasta 15 dígitos'
      };
    default:
      return {
        pattern: '^([0-9]{1,15})$',
        minChars: 6,
        mensaje: 'Se aceptan solamente números'
      };
  }
}
