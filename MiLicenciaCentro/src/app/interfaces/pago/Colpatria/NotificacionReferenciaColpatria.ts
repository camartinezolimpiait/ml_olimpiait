/**
 * Entidad que contiene los datos básicos para la comunicación con
 * Colpatria
 */
export interface NotificacionReferenciaColpatria {
    Email: string;
    IdComercio: string;
    Llave: string;
    NumeroDocumento: string;
    TipoDocumento: string;
    ReferenciaComercio: string;
    ValorCompra: number;
    ValorNeto: number;
    hshId: string;
    TipoComercio: number; // burned
    ValorIva: string,
    CodigoAerolinea: string,
    ValorBaseDevolucion: number,
    ValorBaseDevolucionTarifaAdministrativa: number,
    ValorImpuesto: number,
    ValorIVATarifaAdministrativa: number,
    ValorTarifaAdministrativa:number
  };