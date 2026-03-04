import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { TipoDocumentoPtesaClass } from 'src/app/class/cotizador/tipoDocumentoPtesaClass';
import { TipoCliente } from 'src/app/enums/PinesOlimpia/TipoCliente';
import { TipoDocumentoPtesaDTO } from 'src/app/interfaces/cotizacion/TipoDocumentoPtesaDTO';
import { CorreoCuota } from 'src/app/interfaces/pago/PinesOlimpia/Consulta/CorreoCuota';
import { CuotaCea } from 'src/app/interfaces/pago/PinesOlimpia/Consulta/CuotaCea';
import { PinCea } from 'src/app/interfaces/pago/PinesOlimpia/Consulta/PinCea';
import { PinCeaConsulta } from 'src/app/interfaces/pago/PinesOlimpia/Consulta/PinCeaConsulta';
import { DataService } from 'src/app/services/data/cotizador/data.service';
import { UtilService } from 'src/app/services/util/util.service';
import { CamposValidacion } from './camposValidacion';
import { MensajesValidacion } from './mensajesValidacion';
import { MetodosRecaudoComponent } from './metodos-recaudo/metodos-recaudo.component';
import { ReCaptchaV3Service } from 'ng-recaptcha';

@Component({
  selector: 'app-pago-cuotas',
  templateUrl: './pago-cuotas.component.html',
  styleUrls: ['./pago-cuotas.component.scss']
})
export class PagoCuotasComponent implements OnInit {

  estados = ["Defecto", "Creado", "Recaudado", "Cancelado"];
  estadoPagos = ["Pagar ahora", "Pendiente de pago", "Pagada", "Anulado", "Usado", "Cambio de beneficiario"]
  consultaCeaForm!: FormGroup
  pinesRecuperados: PinCea[] = [];
  cuotaAPagar: any;
  tiposDeDocumento: TipoDocumentoPtesaDTO[] = [];
  plantillas: any;
  tipoCliente:any = TipoCliente;
  camposValidacion: any = CamposValidacion;
  mensajesValidacion: any = MensajesValidacion;
  _tipoDocumentoPtesaClass!: TipoDocumentoPtesaClass;

  constructor(
    private readonly _formBuilder: FormBuilder,
    private readonly _data: DataService,
    public  _dialog: MatDialog,
    private readonly _utils: UtilService,
    private readonly _recaptchaV3Service: ReCaptchaV3Service,
  ) { }

  ngOnInit(): void {
    this._tipoDocumentoPtesaClass = new TipoDocumentoPtesaClass(this._data);
    this.consultaCeaForm = this._formBuilder.group({
      idTipoDocumento: ["", [Validators.required]],
      numeroDocumento: ["", [Validators.required, Validators.pattern('^[0-9^]*$')]],
      correo: [""]
    })
    this.obtenerTiposIdentificacion();
    this.obtenerPlantilla();
    this.consultaCeaForm.get("idTipoDocumento")!.valueChanges.subscribe(x => {
      this._utils.validarNumeroDocumento(this.consultaCeaForm, "idTipoDocumento", "numeroDocumento", this.camposValidacion, this.mensajesValidacion, this.tipoCliente.CEA);
     })
  }

  consultar(tokenCaptcha: string = '') {
    if (this.consultaCeaForm.valid) {
      let consultaCea: PinCeaConsulta = this.consultaCeaForm.value
      consultaCea.idTipoDocumento = +consultaCea.idTipoDocumento
      this._data.consultarPinesCea(consultaCea,tokenCaptcha).subscribe((data: PinCea[]) => {
        this.pinesRecuperados = data;
        if (data != undefined) {
          if (data.length == 0) {
            this._utils.abrirAlerta(
              'No se encontró información relacionada al documento'
            );
            return;
          }
        }
      })
    }
  }

  pagarCuota(cuota: CuotaCea, pinPadre:string,idCentro:string) {
    let obj:CorreoCuota = {
      cuotaCea: cuota,
      PinPadre: pinPadre,
      Plantilla: this.plantillas["CeaRefPDP"],
      idCentro:idCentro
    };
    this._dialog.open(MetodosRecaudoComponent, {
      width: '328px',
      data: obj,
      autoFocus: false
    })
  }


  private obtenerTiposIdentificacion(): void {
    this._tipoDocumentoPtesaClass.get().subscribe((s: TipoDocumentoPtesaDTO[])=>{
      this._tipoDocumentoPtesaClass.set(s);
      this.tiposDeDocumento = this._tipoDocumentoPtesaClass.getDocumentosByClienteCompra(TipoCliente.CEA);
    });
  }


  trackCuota(pinCea: PinCea, cuota: CuotaCea) {
    let primerEstado: boolean = cuota.estado <= 2;
    if(pinCea.cuotas[0].estado == 3)
    {
      return 3
    }
    if (primerEstado) {
      this.cuotaAPagar = pinCea.cuotas.find((x) => x.estado == 1);
      let a = this.cuotaAPagar?.numeroCuota
      let b = cuota.numeroCuota
      if (a == b) {
        return 0
      } else {
        return cuota.estado
      }
    } else {
      return cuota.estado
    }
  }

  obtenerPlantilla(){
    this._data.obtenerPlantillas().subscribe((x:any)=>{
      this.plantillas = x;
    });
  }

  iniciarConsulta(){

    this._recaptchaV3Service.execute('pagoCuotas')
      .subscribe((token) => {
        this.consultar(token);
      },
      (error) => {
        this.consultar();
      });
  }

}
