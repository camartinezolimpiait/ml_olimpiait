import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { AprobacionEstadoRecaudo } from "src/app/interfaces/resumen/aprobacionEstadoRecaudo";
import { datosResumen } from "src/app/interfaces/resumen/datosResumen";
import { DataService } from "src/app/services/data/cotizador/data.service";
import { EncryptService } from "src/app/services/data/encrypt/encrypt.service";

@Component({
  selector: 'app-resumen',
  templateUrl: './resumen.component.html',
  styleUrls: ['./resumen.component.scss']
})
export class ResumenComponent implements OnInit {

  _aprobacionEstadoRecaudo!: AprobacionEstadoRecaudo;
  _datosResumen!: datosResumen;
  _activo: number = 0;
  negocio:string="PSE";
  constructor(
    private readonly _route: ActivatedRoute,
    public _encriptService: EncryptService,
    private readonly _dataService: DataService,
  ) {
  }
  ngOnInit(): void {
    this.configurarNegocio()
  }

  configurarNegocio() {
    this._route.params.subscribe((e: any) => {
      let parametro: string = e.data;
      if(e.negocio!=undefined){
        this.negocio=e.negocio;
      }

      if (parametro != undefined) {
        parametro = parametro.padEnd(parametro.length + (4 - parametro.length % 4) % 4, '=').replace(/\_/g, '/')
          .replace(/\-/g, '+');
        let srtAprobacionEstadoRecaudo = decodeURIComponent(this._encriptService.decryptUsingAES256(parametro));
        if (srtAprobacionEstadoRecaudo != "") {
          let jsonObj: any = JSON.parse(srtAprobacionEstadoRecaudo.toLowerCase());
          let aprobacionEstadoRecaudoTmp: any = <AprobacionEstadoRecaudo>jsonObj;
          this._aprobacionEstadoRecaudo = {
            Aprobado: aprobacionEstadoRecaudoTmp.aprobado,
            Pin: aprobacionEstadoRecaudoTmp.pin,
            Error: aprobacionEstadoRecaudoTmp.error
          };
          if(this._aprobacionEstadoRecaudo.Aprobado){
            this._dataService.seleccionarResumenByPin(this._aprobacionEstadoRecaudo.Pin,this.negocio).subscribe(s =>{
              if(s != null){
                this._datosResumen = s;
                this._activo = 3;
              }
              else{
                this._activo = 1;
              }
            });
          }
          else{
            this._activo = 2;
          }
        }
        else{
          this._activo = 1;
        }
      }
    });
  }

  formatoPesos(valor: any) {
    return Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 }).format(Number(valor));
  }

  formatoMiles(valor: any) {
    return Intl.NumberFormat('es-CO', { minimumFractionDigits: 0 }).format(Number(valor));
  }
}
