export interface Orden {
    orderAmount: number;
    orderTax: number;
    buyerFullName: string;
    buyerType: string;
    buyerIdType?: string;
    buyerIdNumber: number;
    buyerEmail: string;
    buyerPhone: string;
    buyerAddress: string;
    itemName: string;
    itemReference: string;
    paymentReference: string;
}

export interface OrdenResponse {
    message: string;
    order: string;
    paymentReference: string;
    timestamp: string;
}

export interface CrearOrden {
    orden: Orden;
    codigoBanco: string;
    host:string,
}
