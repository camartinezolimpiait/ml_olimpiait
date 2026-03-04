export interface PermiteFacturaElectronicaResponse {
    solicitudExitosa: boolean;
    mensaje: string;
    datos:{
            facturacionHabilitada: boolean;
            codigoDisparador: string;
            nombreProveedorTecnologico: string;
          };
    errores: any[];
}