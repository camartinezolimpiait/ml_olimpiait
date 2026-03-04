import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { Rutas } from "src/app/enums/API/Rutas";
import { MetodosTuPago } from "src/app/enums/API/TuPago";
import { ConsultaTransaccionRequest } from "src/app/interfaces/pago/SecurePay/ConsultaTransaccionRequest";
import { ConsultaTransaccionResponse } from "src/app/interfaces/pago/SecurePay/ConsultaTransaccionResponse";
import { Bancos } from "src/app/interfaces/pago/TuPago/Banco";
import { CrearOrden } from "src/app/interfaces/pago/TuPago/Orden";
import { TransaccionPSEResponse } from "src/app/interfaces/pago/TuPago/TransaccionPSEResponse";
import { environment } from "src/environments/environment";
import { getApiMilicencia } from 'src/app/services/util/api-milicencia.util';

@Injectable({
    providedIn: 'root'
})
export class TuPagoService {
  urlServices: string = getApiMilicencia() + Rutas.ServicioTuPago;


    constructor(private readonly _http: HttpClient) { }

    /**
     * Obtiene la lista de bancos que admite PSE para
     * la transacción
     */
    obtenerBancos(): Observable<Bancos[]> {
      return this._http.get<Bancos[]>(this.urlServices + MetodosTuPago.ObtenerBancos)
    }

    /**
     * Obtiene la url de compra
     * @param compra Valores del pago
     */
    obtenerReferenciaPSE(orden: CrearOrden): Observable<TransaccionPSEResponse> {
      return this._http.post<TransaccionPSEResponse>(this.urlServices + MetodosTuPago.ObtenerReferenciaPSE, orden)
    }

    /**
     * Obtiene la informacion de compra
     * @param infoConsulta Informacion de consulta
     */
    obtenerInformacionTransaccion(infoConsulta: ConsultaTransaccionRequest): Observable<ConsultaTransaccionResponse> {
      return this._http.post<ConsultaTransaccionResponse>(this.urlServices + MetodosTuPago.ObtenerInformacionTransaccion, infoConsulta)
    }
  }
