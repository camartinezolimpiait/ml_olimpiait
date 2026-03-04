import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, Subject } from "rxjs";
import { MetodosCotizador } from "src/app/enums/API/MetodosCotizador";
import { Rutas } from "src/app/enums/API/Rutas";
import { Centro } from "src/app/interfaces/cotizacion/Centro";
import { ConsultaIpResponse } from "src/app/interfaces/Otros/ConsultaIpResponse";
import { currentDataIp } from "src/app/interfaces/Otros/currentDataIp";
import { GetParametro } from "src/app/interfaces/Otros/GetParametro";
import { Ipify } from "src/app/interfaces/Otros/Ipify";
import { environment } from "src/environments/environment";
import { getApiMilicencia } from 'src/app/services/util/api-milicencia.util';
import { DataService } from "../cotizador/data.service";

@Injectable({
    providedIn: "root",
})
export class UtilGeneralService {
    urlServices: string = environment.routingPrefix + Rutas.ServiciosCotizador;
    constructor(private readonly http: HttpClient,
      private readonly _dataService: DataService,
      ) { }

    asignarCentroCurrentDataIp(centro: Centro | undefined, tipoCliente: number | undefined,fn:any){
        return this.validarCurrentDataIp(centro, tipoCliente, (currentDataIp:currentDataIp) =>{
            let obj: string = btoa(encodeURIComponent(JSON.stringify(currentDataIp)));
            localStorage.setItem('_CurrentDataIp', obj);
            fn();
        });
    }

    private validarCurrentDataIp(centro: Centro | undefined | null, tipoCliente: number | undefined | null, fn:any): currentDataIp | null{
        let _currentDataIp = localStorage.getItem('_CurrentDataIp');
        let currentDataIp: currentDataIp | null = null;
        if(_currentDataIp != null){
            let strCurrentDataIp = decodeURIComponent(atob(_currentDataIp));
            let jsonObj: any = JSON.parse(strCurrentDataIp.toLowerCase());
            let currentDataIpTmp: any = <currentDataIp>jsonObj;
            if(!this.calcularMinutosSesion(currentDataIpTmp)){
                currentDataIp =
                {
                    ip: currentDataIpTmp.ip,
                    fecha: currentDataIpTmp.fecha,
                    urlCentro: currentDataIpTmp.urlcentro,
                    estadoIp: currentDataIpTmp.estadoip,
                    centroSeleccionado: centro ?? this.llenarDataCentro(currentDataIpTmp.centroseleccionado),
                    tipoCliente: tipoCliente ?? currentDataIpTmp.tipocliente
                }
                fn(currentDataIp);
            }
        }
        return currentDataIp;
    }
    private llenarDataCentro(centro: any):Centro | null{
        let centroMapeado: Centro | null = null;
        if(centro != undefined || centro != null){
            centroMapeado =
            {
                busqueda: centro.busqueda,
                categorias: centro.categorias,
                codigoRUNT: centro.codigorunt,
                direccion: centro.direccion,
                email: centro.email,
                fijo: centro.fijo,
                idCentro: centro.idcentro,
                idComercio: centro.idcomercio,
                idDepartamento: centro.iddepartamento,
                idMunicipio: centro.idmunicipio,
                latitud: centro.latitud,
                longitud: centro.longitud,
                movil: centro.movil,
                nombre: centro.nombre,
                distancia: centro.distancia,
                idzona: centro.idzona,
            };
        }
        return centroMapeado;
    }

    calcularMinutosSesion(data: currentDataIp): boolean {
        if(data.fecha !== undefined || data.fecha != null)
        {
            let dateParam: any = new Date(data.fecha);
            let fechaActual: Date = new Date();
            return (Date.parse(fechaActual.toString()) > Date.parse(dateParam) ? true : false)
        }
        else
        {
            return false
        }
    }
    crearCentroCurrentDataIp(centro: Centro | undefined, tipoCliente: number | undefined, fn:any){
        this._dataService.NuevaVigenciaIp().subscribe((x:ConsultaIpResponse)=>{
            let currentDataIp: currentDataIp = {
                ip: "",
                fecha: x.fechaVigencia,
                urlCentro: x.urlCentro,
                estadoIp: x.estado,
                centroSeleccionado: centro,
                tipoCliente: tipoCliente
            };
            let obj: string = decodeURIComponent(btoa(JSON.stringify(currentDataIp)));
            localStorage.setItem('_CurrentDataIp', obj);
            fn();
        });
    }

    public errorHttpSubject$ = new Subject<HttpErrorResponse>();
    errorHttp = this.errorHttpSubject$.asObservable();
    getUrlIp(): Observable<GetParametro> {
      return this.http.post<GetParametro>(
        getApiMilicencia() +
        "/servicios/Cotizador/ObtenerUrlIp", null
      );
    }

    consultaIp(ip: string): Observable<ConsultaIpResponse> {
      let url = getApiMilicencia() + Rutas.ServiciosCotizador + MetodosCotizador.ConsultaIp + "/" + ip;
      return this.http.get<ConsultaIpResponse>(url);
    }

    UrlIpTemp: string = "";
    ObtenerIp(fn:any){
      let currentDataIp: currentDataIp | null = this.obtenerCurretDataIp();
      if(currentDataIp === null){
        this.getUrlIp().subscribe(
          (x: GetParametro)=> {
            if(x != null){
              this.UrlIpTemp = x.valor;
              this.http.get(x.valor).subscribe(
                (x: any)=>{
                  let consultaIp= x.ip;
                  this.consultaIp(consultaIp).subscribe((response:ConsultaIpResponse)=>{
                    let data: currentDataIp = {
                      ip: x.ip,
                      urlCentro: response.urlCentro,
                      fecha: response.fechaVigencia,
                      estadoIp: response.estado,
                      centroSeleccionado: null,
                      tipoCliente: null
                    };
                    let obj: string = decodeURIComponent(btoa(JSON.stringify(data)));
                    localStorage.setItem('_CurrentDataIp', obj)
                    fn(data);
                  });
              });
            }
            else{
              fn(null);
            }
        });
        //si falla la peticion en el interceptor se suscribe a un error
        this.errorHttp.subscribe((x: any)=> {
          if(this.UrlIpTemp.replace("/?", "?") === x.url.replace("/?", "?")){
            fn(null);
          }
        });
      }
      else{
        fn(currentDataIp);
      }
    }

    obtenerCurretDataIp(): currentDataIp | null{
       return this.validarCurrentDataIp(null, null, ()=>{});
    }

  getUrlWPGQL(): Observable<GetParametro> {
    return this.http.post<GetParametro>(
      getApiMilicencia() +
      "/servicios/Cotizador/ObtenerUrlGQL", null
    );
  }

    quitarCentroCurrentDataIp(fn:any){
        return this.validarCurrentDataIp(null, null, (currentDataIp:currentDataIp) =>{
            currentDataIp.centroSeleccionado = null;
            currentDataIp.tipoCliente = null;
            let obj: string = btoa(encodeURIComponent(JSON.stringify(currentDataIp)));
            localStorage.setItem('_CurrentDataIp', obj);
            fn();
        });
    }
}
