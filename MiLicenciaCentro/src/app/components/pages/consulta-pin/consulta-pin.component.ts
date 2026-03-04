import { Component, OnInit } from '@angular/core'
import { FormGroup, FormBuilder, Validators } from '@angular/forms'
import { DataService } from 'src/app/services/data/cotizador/data.service'
import { UtilService } from 'src/app/services/util/util.service'
import { BusquedaPin } from 'src/app/interfaces/pago/PinesOlimpia/BusquedaPin'
import { TitulosPagina } from 'src/app/enums/navegacionPagina/TitulosPagina'
import { TipoCliente } from 'src/app/enums/PinesOlimpia/TipoCliente'
import { Centro } from 'src/app/interfaces/cotizacion/Centro'
import { Observable } from 'rxjs'
import { FormControl } from '@angular/forms';
import { map, startWith } from 'rxjs/operators';
import { SecurePayService } from 'src/app/services/data/secure-pay/secure-pay.service'
import { ConsultaTransaccionRequest } from 'src/app/interfaces/pago/SecurePay/ConsultaTransaccionRequest';
import { PinesConsulta } from 'src/app/interfaces/pago/PinesOlimpia/Respuesta/PinesConsulta'
import { TipoPago } from 'src/app/enums/PinesOlimpia/TipoPago'
import { EstadoRecaudo } from 'src/app/interfaces/pago/PinesOlimpia/EstadoRecaudo'
import { EstadoSecurePay } from 'src/app/enums/API/SecurePay';
import { UtilGeneralService } from 'src/app/services/data/util-general/utilGeneral.service'
import { currentDataIp } from 'src/app/interfaces/Otros/currentDataIp'
import { TipoDocumentoPtesaDTO } from 'src/app/interfaces/cotizacion/TipoDocumentoPtesaDTO'
import { TipoDocumentoPtesaClass } from 'src/app/class/cotizador/tipoDocumentoPtesaClass'
import { ConsultaTransaccionTipoCliente } from 'src/app/interfaces/pago/SecurePay/ConsultaTransaccionTipoCliente'
import { CamposValidacion } from './camposValidacion'
import { MensajesValidacion } from './mensajesValidacion'
import { ReCaptchaV3Service } from 'ng-recaptcha'
import { RespuestaRecaptcha } from 'src/app/interfaces/Otros/RespuestaRecaptcha'
import { CompraPinService } from 'src/app/services/data/compra-pin/compra-pin.service'
import { SharedService } from 'src/app/services/data/cliente/cliente.service';
@Component({
  selector: 'app-consulta-pin',
  templateUrl: './consulta-pin.component.html',
  styleUrls: ['./consulta-pin.component.scss']
})
export class ConsultaPinComponent implements OnInit {
  maxDate = new Date()
  minDate = new Date(this.maxDate.getFullYear() - 100, 0, 1)
  displayedColumns: string[] = ['pin', 'state', 'update']
  dataSource: any = {}
  queryPins!: FormGroup
  success = false
  submitted = false
  tiposDeDocumento: TipoDocumentoPtesaDTO[] = [];
  centros: Centro[] = [];
  filteredOptions!: Observable<Centro[]>
  codigoRuntCentro: string = ''
  nombreCentro: any = new FormControl()
  today: Date = new Date()
  buttonDisabled: boolean = false
  timeOut: any;
  _tipoDocumentoPtesaClass!: TipoDocumentoPtesaClass;
  clienteAnulacion!: number;
  camposValidacion: any = CamposValidacion;
  mensajesValidacion: any = MensajesValidacion;
  _tokenCaptcha: string = '';
  tipoCliente: any;
  tiposervicio: string= '';

  constructor(
    private readonly _formBuilder: FormBuilder,
    private readonly _utils: UtilService,
    private readonly _data: DataService,
    private readonly _securePayService: SecurePayService,
    private readonly _utilGeneral: UtilGeneralService,
    private readonly _recaptchaV3Service: ReCaptchaV3Service,
    private readonly _mlCompraPin: CompraPinService,
    private readonly sharedService: SharedService
  ) { }
  ngOnInit() {
    this.sharedService.tipoServicio$.subscribe(tipoServicio => {
      console.log(tipoServicio);
      if(tipoServicio){
       this.tipoCliente = tipoServicio
      }
    });
    this._utils.cambiarTituloPagina(TitulosPagina.Consulta);
    this._tipoDocumentoPtesaClass = new TipoDocumentoPtesaClass(this._data);
    this._tipoDocumentoPtesaClass.get().subscribe((s: TipoDocumentoPtesaDTO[]) => {
      this._tipoDocumentoPtesaClass.set(s);
      this.tiposDeDocumento = this._tipoDocumentoPtesaClass.getDocumentosByClienteCompra(TipoCliente.CRC);
    });
    this.queryPins = this._formBuilder.group({
      typeDocument: ['', Validators.required],
      idDocument: ['', Validators.required],
      boughtDate: ['', Validators.required],
    })
    this.obtenerCentros();

    this.queryPins
      .get('typeDocument')!
      .valueChanges.subscribe((x) => {
        this._utils.validarNumeroDocumento(
          this.queryPins,
          'typeDocument',
          'idDocument',
          this.camposValidacion,
          this.mensajesValidacion,
          TipoCliente.CEA
        );
    })
  }



  private filtrarCentros(centros: Centro[], cambio: boolean = false) {
    cambio ? this.nombreCentro.setValue('') : '';
    this.filteredOptions = this.nombreCentro.valueChanges
      .pipe(
        startWith(''),
        map((value: any) => typeof value === 'string' ? value : value.nombre),
        map((name: any) => name ? this._filter(name) : centros !== undefined ? centros.slice() : null)
      );
  }

  displayFn(centro: Centro): string {
    return centro?.nombre ?? '';
  }

  private _filter(name: string): Centro[] {
    const filterValue = name.toLowerCase();
    return this.centros.filter(option => option.nombre.toLowerCase().includes(filterValue));
  }

  centroSeleccionado(centro: Centro) {
    this.codigoRuntCentro = centro.codigoRUNT.toString();
  }

  obtenerCentros() {
      if(this.tipoCliente==3){
        this._mlCompraPin
        .consultarTodosCentroNegocio({
          id: 0,
          plataforma: "CRC",
        })
        .subscribe((listadoCentros:Centro[]) => {
          this.centros = listadoCentros;

        });
        this.tiposervicio= 'CRC'
      }
      else 
      {
        this._mlCompraPin
          .consultarTodosCentroNegocio({
            id: 0,
            plataforma: "CEA",
          })
          .subscribe((listadoCentros:Centro[]) => {
            this.centros = listadoCentros;
        });
        this.tiposervicio= 'CEA'
      }
      this.filtrarCentros(this.centros)
      this.validarIpCentro()
  }

  private validarIpCentro() {
    this._utilGeneral.ObtenerIp((data: currentDataIp) => {
      if (data != null) {
        if (data.centroSeleccionado != null) {
          this.nombreCentro.setValue(data.centroSeleccionado);
          this.centroSeleccionado(data.centroSeleccionado);
        }
      }
    });
  }

  desenmascararValor(val: string) {
    let x = this.queryPins.get("typeDocument")!.value
    return this._utils.desenmascararValor(val, x)
  }

  onSubmit() {
    this._recaptchaV3Service.execute('ConsultaPines')
      .subscribe((token) => {
        this._tokenCaptcha = token;
        this.submitted = true;
        this.consultar();
      },
        (error) => {
          this._tokenCaptcha = '';
          this.consultar();
        });
  }


  consultar() {
    if (!this.submitted) {
      this._utils.abrirAlerta(
        'No se pudo completar la verificación captcha, intente más tarde.'
      );
      return;
    }
    this.dataSource = null
    if (this.queryPins.invalid || this.nombreCentro.value == null) {
      this._utils.abrirAlerta('Por favor, complete todos los campos')
      return
    }
    let formulario: FormGroup = this.queryPins
    let data: BusquedaPin = this.obtenerDatosBusquedaPin(formulario)
    this._data.consultarPinesCompradosPSE(data, this._tokenCaptcha).subscribe((x: RespuestaRecaptcha<PinesConsulta>) => {
      if (!x.ok) {
        this._utils.abrirAlerta(x.mensaje);
        return;
      }

      if (x.data?.length == 0) {
        this._utils.abrirAlerta('No existen pines, Intente nuevamente')
      } else {
        this.dataSource = x.data;
        this.success = true;
      }
    })
  }



  updateSecurePay(numeroCus: string, pin: string) {
    this.buttonDisabled = true;
    let consultaSP: ConsultaTransaccionRequest = {
      fechaTransaccionDesde: this.queryPins.get("boughtDate")!.value.format('DD/MM/YYYY'),
      fechaTransaccionHasta: this.queryPins.get("boughtDate")!.value.format('DD/MM/YYYY'),
      referenciaPago: "",
      cus: numeroCus,
    };

    let consultaTransaccionTipoCliente: ConsultaTransaccionTipoCliente = {
      consultaTransaccion: consultaSP,
      tipoCliente: TipoCliente.CRC
    }

    this._securePayService.obtenerInformacionTransaccion(consultaTransaccionTipoCliente).subscribe(x => {
      x.reporteDetallado.reporteDetallado.forEach(element => {
        if (element.conceptoPago.endsWith(pin) && element.estado != "Pendiente") {
          let respuestaConsultaSecurePay: EstadoRecaudo = {
            valorTransaccion: element.valorTotal,
            referenciaComercio: Number(element.referenciaPago),
            referenciaMedio: element.cus,
            formDataRespuesta: JSON.stringify(element),
            codigoEstado: this.getCodigoEstadoSP(element.estado),
            nombreEstado: element.estado,
            canalUso: 1, //Confirmacion
            idCliente: TipoCliente.CRC
          }
          this._data.confirmarConsultaSecurePay(respuestaConsultaSecurePay).subscribe(x => {
            clearTimeout(this.timeOut);
            this.buttonDisabled = false;
            this.onSubmit();
          });
        }
      });
    });
    this.timeOut = setTimeout(() => {
      this.buttonDisabled = false
    }, 60000);
  }

  updateShow(pinConsultado: PinesConsulta) {
    return pinConsultado.origenRecaudo == TipoPago.PSE && pinConsultado.idEstadoTransaccion == 5 && pinConsultado.estado == "Referencia generada sin recaudo.";
  }

  private getCodigoEstadoSP(estado: string) {
    switch (estado) {
      case "Activo": return EstadoSecurePay.Activo;
      case "Inactivo": return EstadoSecurePay.Inactivo;
      case "Aprobado": return EstadoSecurePay.Aprobado;
      case "Rechazado": return EstadoSecurePay.Rechazado;
      case "Pendiente": return EstadoSecurePay.Pendiente;
      case "Fallido": return EstadoSecurePay.Fallido;
      case "Finalizado": return EstadoSecurePay.Finalizado;
      case "Cancelado": return EstadoSecurePay.Cancelado;
      default: return 0;
    }
  }

  /**
   * Obtiene los datos que se requieren para buscar pin
   * @param controls Controles del formulario
   */
  private obtenerDatosBusquedaPin(formulario: FormGroup): BusquedaPin {
    return {
      fechaCompraPin: formulario.get("boughtDate")!.value.format('YYYY-MM-DD'),
      codigoRuntCentro: this.codigoRuntCentro,
      tipoIdentificacionUsuario: +formulario.get("typeDocument")!.value,
      identificacionUsuario: this.desenmascararValor(
        formulario.get("idDocument")!.value,
      ),
      idCliente: TipoCliente.CRC
    }
  }
}
