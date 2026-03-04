export interface EntidadMensaje {
    Adjuntos: EntidadAdjunto[];
    Aplicacion: string;
    Asunto: string;
    CodigoPlantilla: string;
    Destinatarios: EntidadDestinatario[];
    Variables: EntidadVariable[];
  }
  
  export interface EntidadAdjunto {
    Ruta: string;
  }
  
  export interface EntidadDestinatario {
    Correo: string;
    Identificacion: string;
    Tipo: number;
  }
  
  export interface EntidadVariable {
    Nombre: string;
    Valor: string;
  }