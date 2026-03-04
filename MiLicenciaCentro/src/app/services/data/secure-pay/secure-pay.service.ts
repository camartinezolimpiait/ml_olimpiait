import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { MetodosSecurePay } from "src/app/enums/API/MetodosSecurePay";
import { Rutas } from "src/app/enums/API/Rutas";
import { Banco } from "src/app/interfaces/pago/SecurePay/Banco";
import { CompraTipoCliente } from "src/app/interfaces/pago/SecurePay/CompraTipoCliente";
import { ConsultaTransaccionResponse } from "src/app/interfaces/pago/SecurePay/ConsultaTransaccionResponse";
import { ConsultaTransaccionTipoCliente } from "src/app/interfaces/pago/SecurePay/ConsultaTransaccionTipoCliente";
import { RespuestaPse } from "src/app/interfaces/pago/SecurePay/RespuestaPse";
import { environment } from "src/environments/environment";
import { getApiMilicencia } from 'src/app/services/util/api-milicencia.util';

@Injectable({
    providedIn: 'root'
})
export class SecurePayService {
    urlServices: string = getApiMilicencia() + Rutas.ServicioSecurePay;

    constructor(private readonly _http: HttpClient) { }
    /**
    * Obtiene la lista de bancos que admite PSE para
    * la transacción
    */
    obtenerBancos(tipoCliente:number): Observable<Banco[]> {
        return this._http.get<Banco[]>(this.urlServices + MetodosSecurePay.ObtenerBancos+ "/" + tipoCliente.toString() );
    }

    /**
    * Obtiene la url de compra
    * @param compra Valores del pago
    */
    obtenerReferenciaPSE(compra: CompraTipoCliente): Observable<RespuestaPse> {
        return this._http.post<RespuestaPse>(this.urlServices + MetodosSecurePay.ObtenerReferenciaPSE, compra)
    }

    /**
    * Obtiene la informacion de compra
    * @param infoConsulta Informacion de consulta
    */
    obtenerInformacionTransaccion(infoConsulta: ConsultaTransaccionTipoCliente): Observable<ConsultaTransaccionResponse> {
        return this._http.post<ConsultaTransaccionResponse>(this.urlServices + MetodosSecurePay.ObtenerInformacionTransaccion, infoConsulta)
    }
}
