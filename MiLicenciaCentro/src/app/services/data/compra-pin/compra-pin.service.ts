import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { MetodosCompraPin } from "src/app/enums/API/MetodosCompraPin";
import { Rutas } from "src/app/enums/API/Rutas";
import { CentroParametros } from "src/app/interfaces/compraPin/CentroParametros";
import { consultaCentroParametros } from "src/app/interfaces/compraPin/consultaCentroParametro";
import { ConsultaCentroPorCategoria } from "src/app/interfaces/compraPin/ConsultaCentroPorCategoria";
import { ConsultaCentroPorId } from "src/app/interfaces/compraPin/ConsultaCentroPorId";
import { ConsultaCostoPinCea } from "src/app/interfaces/compraPin/ConsultaCostoPinCea";
import { Centro } from "src/app/interfaces/cotizacion/Centro";
import { DiscriminadoValorPin } from "src/app/interfaces/cotizacion/DiscriminadoValorPin";
import { environment } from "src/environments/environment";
import { getApiMilicencia } from 'src/app/services/util/api-milicencia.util';
import { RoutesService } from "../../routes/routes.service";

@Injectable({
    providedIn: 'root'
})
export class CompraPinService {
  urlServices: string = getApiMilicencia() + Rutas.ServiciosCompraPin;
    constructor(
      private readonly _http: HttpClient,
      private readonly _rutas: RoutesService
    ) { }

    consultarTodosCentroNegocio(consulta: ConsultaCentroPorId): Observable<Centro[]>{
      return this._http.post<Centro[]>(this.urlServices + MetodosCompraPin.ConsultarTodosCentroNegocio, consulta);
    }

    consultarCentroPorCategoria(consulta: ConsultaCentroPorCategoria): Observable<Centro[]> {
      return this._http.post<Centro[]>(this.urlServices + MetodosCompraPin.ConsultarCentroPorCategoria, consulta);
    }

    obtenerPrecioPINCEA(parametrosCosto: ConsultaCostoPinCea): Observable<DiscriminadoValorPin> {
      return this._http.post<DiscriminadoValorPin>(this.urlServices + MetodosCompraPin.ObtenerValorDelPinCEA, parametrosCosto)
    }

    ObtenerCentroParametrosIdCentro(parametrosConsulta: consultaCentroParametros): Observable<CentroParametros[]> {
      return this._http.post<CentroParametros[]>(this.urlServices + MetodosCompraPin.ObtenerCentroParametrosIdCentro, parametrosConsulta)
    }
}
