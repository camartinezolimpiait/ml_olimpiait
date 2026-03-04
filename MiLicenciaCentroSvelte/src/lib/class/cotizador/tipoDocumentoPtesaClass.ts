/**
 * Clase para gestionar tipos de documento según cliente y edad.
 * Migrado desde Angular: src/app/class/cotizador/tipoDocumentoPtesaClass.ts
 */
import type { TipoDocumentoPtesaDTO } from '$lib/interfaces/cotizacion/TipoDocumentoPtesaDTO';
import { TipoCliente } from '$lib/enums/PinesOlimpia/TipoCliente';

/**
 * Gestiona los tipos de documento disponibles para compra y devoluciones
 * según el tipo de cliente (CRC o CEA) y edad.
 */
export class TipoDocumentoPtesaClass {
  private documentos: TipoDocumentoPtesaDTO[] = [];

  constructor(documentos: TipoDocumentoPtesaDTO[]) {
    this.documentos = documentos;
  }

  /**
   * Filtra documentos según el tipo de cliente (CRC o CEA).
   */
  getDocumentosByClienteCompra(tipoCliente: TipoCliente): TipoDocumentoPtesaDTO[] {
    return this.documentos.filter((doc) => {
      if (tipoCliente === TipoCliente.CRC) return doc.visualizarCRC;
      if (tipoCliente === TipoCliente.CEA) return doc.visualizarCEA;
      return true;
    });
  }

  /**
   * Filtra documentos según cliente y rango de edad del aspirante.
   */
  getDocumentosByClienteCompraEdad(
    tipoCliente: TipoCliente,
    edad: number
  ): TipoDocumentoPtesaDTO[] {
    return this.getDocumentosByClienteCompra(tipoCliente).filter((doc) => {
      const cumpleEdadMinima = doc.edadMinima === undefined || edad >= doc.edadMinima;
      const cumpleEdadMaxima = doc.edadMaxima === undefined || edad <= doc.edadMaxima;
      return cumpleEdadMinima && cumpleEdadMaxima;
    });
  }

  /**
   * Filtra documentos para devoluciones según el tipo de cliente.
   */
  getDocumentosByClienteCompraDevoluciones(tipoCliente: TipoCliente): TipoDocumentoPtesaDTO[] {
    return this.documentos.filter((doc) => {
      if (tipoCliente === TipoCliente.CRC) return doc.visualizarCRC;
      if (tipoCliente === TipoCliente.CEA) return doc.visualizarCEA;
      return true;
    });
  }
}
