import { Component, OnInit, Input } from '@angular/core';
import { OrigenPinActu } from 'src/app/enums/OrigenPinActu';
import { TipoCliente } from 'src/app/enums/PinesOlimpia/TipoCliente';
import { ConvenioOrigenVista } from 'src/app/interfaces/compraPin/ConvenioOrigenVista';
import { ConvenioResumenObj } from 'src/app/interfaces/compraPin/ConvenioResumenObj';
import { ParametrosMensaje } from 'src/app/interfaces/notificacion/ParametrosMensaje';
import { DataService } from 'src/app/services/data/cotizador/data.service';

@Component({
  selector: 'app-convenio-resumen',
  templateUrl: './convenio-resumen.component.html',
  styleUrls: ['./convenio-resumen.component.scss']
})
export class ConvenioResumenComponent implements OnInit {
  vista: string = "";
  tipoCliente: any = TipoCliente;

  @Input() idOrigenPin!: number;
  @Input() convenioResumenObj: ConvenioResumenObj[] = [];
  @Input() parametrosMensaje!: ParametrosMensaje;
  @Input() clienteCompra!: number;
  corresponsal: string = '';
  constructor(private readonly _data: DataService) {
  }

  ngOnInit(): void {
    if (this.idOrigenPin != 0) {
      let tipoPin: number = (this.clienteCompra == this.tipoCliente.CRC? 1 : 2);
      this._data.ObtenerConvenioOrigenVista(this.idOrigenPin, tipoPin).subscribe((x: ConvenioOrigenVista) => {
        let plantilla: string = "";
        if (x.idOrigenPin == 0 && x.idTipoPin == 0) {
          plantilla = x.plantilla;
        } else {
          if (this.idOrigenPin == 5 && this.clienteCompra == this.tipoCliente.CEA) {
            let coutas = this.convenioResumenObj.find(x => x.nombre == "cuotas")?.valor!;
            if (coutas >= 1) {
              plantilla = x.plantillaCuota;
            }
          }
          plantilla = (plantilla == "" ? x.plantilla : plantilla);
          this._data.enviarCorreo(this.parametrosMensaje).subscribe(x => {
          });
        }
        this.vista = this.replaceContent(plantilla, this.convenioResumenObj);

      });
    }
  }

  obtenerMedioPago(idOrigenPin: number){
    switch (this.idOrigenPin){
      case OrigenPinActu.CorresponsalBancolombia: //1
      return "Corresponsal Bancolombia";
      case OrigenPinActu.puntoRed: //3
      return "Punto red";
      case OrigenPinActu.PuntoPagoPinesOlimpia: //5
      return "SuperGiros";
      case OrigenPinActu.PuntoPagoCrc: //8
      return "Punto pago (Multiservicios Express)";
      case OrigenPinActu.Bancoomeva: //10
      return "Punto Pago Bancoomeva";
      case OrigenPinActu.PinPrueba: //11
      return "PinPrueba";
      case OrigenPinActu.PDPBancolombia: //12
      return "Punto Pago Bancolombia";
      default:
        return "Corresponsal";
      }
  }

  replaceContent(html: string, datos: ConvenioResumenObj[]): string {
    this.corresponsal = this.obtenerMedioPago(this.idOrigenPin);
    datos.push({
      nombre: "corresponsal",
      valor: this.corresponsal
    });
    datos.forEach((dato: ConvenioResumenObj) => {
      html = html.replace("$" + dato.nombre, dato.valor);
    });
    return html;
  }
}
