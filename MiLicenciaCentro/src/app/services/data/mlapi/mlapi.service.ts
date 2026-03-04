import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { MetodosCompraPin } from "src/app/enums/API/MetodosCompraPin";
import { Rutas } from "src/app/enums/API/Rutas";
import { CategoriasPorCentroResponse } from "src/app/interfaces/admin/adminAgenda/CategoriasPorCentroResponse";
import { ConsultaCategoriaPorCentro } from "src/app/interfaces/admin/adminAgenda/ConsultaCategoriaPorCentro";
import { InformacionAgenda } from "src/app/interfaces/agendamiento/CEA/InformacionAgenda";
import { ConsultaBase } from "src/app/interfaces/comun/ConsultaBase";
import { Categoria } from "src/app/interfaces/cotizacion/Categoria";
import { TipoIdentificacion } from "src/app/interfaces/cotizacion/TipoIdentificacion";
import { environment } from "src/environments/environment";
import { getApiMilicencia } from 'src/app/services/util/api-milicencia.util';
import { RoutesService } from "../../routes/routes.service";

@Injectable({
    providedIn: 'root'
})
export class MlapiService {
    urlServices: string = getApiMilicencia() + Rutas.ServiciosCompraPin;
    constructor(private readonly _rutas: RoutesService,
      private readonly _http: HttpClient) { }

    obtenerCategoriasPorCentro(request: ConsultaCategoriaPorCentro):Observable<CategoriasPorCentroResponse[]> {
        return this._http.post<CategoriasPorCentroResponse[]>(this.urlServices +  MetodosCompraPin.ListarCategoriasPorIdCentro, request)
    }

    obtenerCategorias(): Observable<Categoria[]> {
        return this._http.get<Categoria[]>(this.urlServices +  MetodosCompraPin.Categorias);
    }

    obtenerTiposIdentificacion(): Observable<TipoIdentificacion[]> {
        return this._http.get<TipoIdentificacion[]>(this.urlServices + MetodosCompraPin.TiposIdentificacion);
    }

    consultarAgendaPorEstudiante(consulta: ConsultaBase): Observable<InformacionAgenda[]> {
        return this._http.post<InformacionAgenda[]>(this.urlServices + MetodosCompraPin.ConsultarAgendaPorEstudiante, consulta)
    }
}
