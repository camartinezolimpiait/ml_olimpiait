import { Destinatario } from "./Destinatario";
import { VariableCorreo } from './Variable';

export interface FormatoCorreo {
  Destinatarios: Destinatario[];
  Variables: VariableCorreo[];
  Aplicacion: string;
  CodigoPlantilla: string;
  Asunto: string;
}
