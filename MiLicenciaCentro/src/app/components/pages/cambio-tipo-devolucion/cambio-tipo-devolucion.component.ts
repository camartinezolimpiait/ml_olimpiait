import { Component, OnInit, Input } from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  Validators,
  FormControl,
  AbstractControl,
  ValidationErrors,
} from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { DataService } from 'src/app/services/data/cotizador/data.service';
import { UtilService } from 'src/app/services/util/util.service';
import {
  AccionBeneficiario,
  DescripcionSolicitudOperacionBancolombia,
} from 'src/app/enums/PinesOlimpia/AccionBeneficiario';
import { TipoCuentaDevolucion } from 'src/app/enums/PinesOlimpia/TipoCuentaDevolucion';
import { BancosPinesOlimpia } from 'src/app/interfaces/pago/PinesOlimpia/BancosPinesOlimpia';
import { EnvioOtpAccionBancolombia } from 'src/app/interfaces/pago/PinesOlimpia/EnvioOtpAccionBancolombia';
import { RespuestaAcciones } from 'src/app/interfaces/pago/PinesOlimpia/RespuestaAccionBeneficiario';
import { Transferencia } from 'src/app/interfaces/pago/PinesOlimpia/Devoluciones/Transferencia';
import { FormularioDevolucion } from 'src/app/interfaces/pago/PinesOlimpia/Devoluciones/FormularioDevolucion';
import { TipoCliente } from 'src/app/enums/PinesOlimpia/TipoCliente';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmarOperacionComponent } from './confirmar-operacion/confirmar-operacion.component';
import { ConfirmOTPComponent } from './confirm-otp/confirm-otp.component';
import { SimpleInfoComponent } from './simple-info/simple-info.component';
import { Icons } from 'src/app/enums/Utils/Icons';
import { MensajesValidacion } from './mensajesValidacion';
import { CamposValidacion } from './camposValidacion';
import { Analytics } from 'src/app/interfaces/Otros/Analytics';
import { GoogleAnalyticsService } from 'src/app/services/data/googleAnalytics/google-analytics.service';
import { AgenteDispersion } from 'src/app/interfaces/comun/AgenteDispersion';
import { AgenteDispersionRequest } from 'src/app/interfaces/comun/AgenteDispersionRequest';
import { TiposDevolucionActivasPorPin } from 'src/app/enums/PinesOlimpia/TiposDevolucionActivasPorPin';
import { Meta } from '@angular/platform-browser';
import { TipoDocumentoPtesaDTO } from 'src/app/interfaces/cotizacion/TipoDocumentoPtesaDTO';
import { TipoDocumentoPtesaClass } from 'src/app/class/cotizador/tipoDocumentoPtesaClass';
import { MotivoDevolucionDto } from 'src/app/interfaces/devoluciones/MotivoDevolucionDto';
import { ResponseDtoOfPtsaDatosContactoDtoYPlxipCl } from 'src/app/interfaces/devoluciones/ResponseDtoOfPtsaDatosContactoDtoYPlxipCl';
import { DatosReferencia } from 'src/app/interfaces/cotizacion/DatosReferencia';
import { InfoPinSimple } from 'src/app/interfaces/devoluciones/InfoPinSimple';
import { FileToUpload } from 'src/app/interfaces/devoluciones/FileToUpload';
import { ActualizarDevolucionTransferenciaRequest } from 'src/app/interfaces/devoluciones/ActualizarDevolucionTransferenciaRequest';
import { tipoDevolucion } from 'src/app/enums/cambio-tipo-devolucion/tipoDevolucion';
import { MotivoCambioDevolucion } from 'src/app/enums/cambio-tipo-devolucion/MotivoCambioDevolucion';
import { CambiotipoDevolucion } from 'src/app/interfaces/cambio-tipo-devolucion/cambio-tipo-devolucion';
import { validacionOtp } from 'src/app/interfaces/cambio-tipo-devolucion/validacionOtp';
import { Destinatario } from 'src/app/interfaces/cambio-tipo-devolucion/destinatario';
import { ReCaptchaV3Service } from 'ng-recaptcha';
import { ConsultaEstadoDevolucion } from 'src/app/interfaces/devoluciones/ConsultaEstadoDevolucion';
import { OrigenCotizacion } from 'src/app/enums/PinesOlimpia/OrigenCotizacion';


enum PasosFormulario {
  DatosCompra = 1,
  DatosUsuario,
  TipoTransferencia,
  TransferenciaBanco,
}
@Component({
  selector: 'app-cambio-tipo-devolucion',
  templateUrl: './cambio-tipo-devolucion.component.html',
  styleUrls: ['./cambio-tipo-devolucion.component.scss']
})
export class CambioTipoDevolucionComponent implements OnInit {

  @Input() TipoDocumento!: number;
  @Input() documentoIdentidad: string = "";
  @Input() pin!: string;

  tipoCuentaDevolucion = TipoCuentaDevolucion;
  accionBeneficiario = AccionBeneficiario;
  tipoDevolucion = tipoDevolucion;
  MotivoCambioDevolucion = MotivoCambioDevolucion;
  descripcionSolicitudOperacionBancolombia =
    DescripcionSolicitudOperacionBancolombia;
  pasosFormulario: any = PasosFormulario;
  formularioActivo!: number;
  actionsBancolombiaForm!: FormGroup;
  devolucionTransferenciaForm!: FormGroup;
  datosContacto!: FormGroup;
  success = false;
  destinatario!: Destinatario;
  otp!: number;
  validarOtp!: validacionOtp;
  respuestaOtp!: RespuestaAcciones;
  submitted = false;
  bancos: any = [];
  tiposDeDocumento: TipoDocumentoPtesaDTO[] = [];
  formaDevolucion: FormControl = new FormControl('', [Validators.required]);
  clienteAnulacion!: number;
  tipoCliente: any = TipoCliente;
  longitudDocumento: number = 11;
  tipoNit!: TipoDocumentoPtesaDTO;
  camposValidacion: any = CamposValidacion;
  mensajesValidacion: any = MensajesValidacion;
  analytics: Analytics = {
    inicio: false,
    fin: false,
    label: '',
  };
  tiposDevolucionActivasPorPin = TiposDevolucionActivasPorPin;
  tipoDevolucionActiva: number = 0;
  _tipoDocumentoPtesaClass!: TipoDocumentoPtesaClass;
  /* objetos nuevos de devoluciones */
  motivosDevolucion!: MotivoDevolucionDto[];
  consultaInfoPin!: ResponseDtoOfPtsaDatosContactoDtoYPlxipCl;
  editarInformacionContacto: boolean = false;
  idMotivoDevolucion: number = 0;
  datosReferencia!: DatosReferencia;
  tipoPin!: number;
  tipoNegocio!: number;
  infopinGeneral!: InfoPinSimple;
  archivoCertificacionBancaria!: FileToUpload;
  camposIguales: boolean = true;


  constructor(
    private readonly _formBuilder: FormBuilder,
    private readonly _data: DataService,
    private readonly _utils: UtilService,
    private readonly _bottomSheet: MatDialog,
    private readonly _route: ActivatedRoute,
    private readonly _googleAnalyticsService: GoogleAnalyticsService,
    private readonly meta: Meta,
    private readonly route: Router,
    private readonly _recaptchaV3Service: ReCaptchaV3Service,
  ) { }

  avanzar(): void {

    if (this.pasosFormulario.DatosCompra) {

      this.iniciarProceso();
    } else {

      if (this.formularioActivo < 8) {

        this.formularioActivo += 1;
      }
    }
    this.validarTransferencia();
  }

  avanzar2(): void {

    if (this.formularioActivo < 8) {

      this.formularioActivo += 1;
    }

  }

  volver(): void {
    if (this.formularioActivo > 1) this.formularioActivo -= 1;
    this.eliminarNit();
  }

  validarTransferencia() {

    if (
      this.formaDevolucion.value == '2' &&
      this.tiposDeDocumento.find(
        (x) => x.idTipoSisec == this.tipoNit.idTipoSisec
      ) == undefined
    ) {
      if (this.tipoNit != undefined)
        this.tiposDeDocumento.push(this.tipoNit);
    }
  }

  eliminarNit() {
    if (this.tipoNit != undefined) {
      this.tiposDeDocumento = this.tiposDeDocumento.find(
        (x) => x.idTipoSisec == this.tipoNit.idTipoSisec
      )
        ? this.tiposDeDocumento.filter(
          (x) => x.idTipoSisec != this.tipoNit.idTipoSisec
        )
        : this.tiposDeDocumento;
    }
  }
  ngOnInit() {

    this.imprimirAtributos();

    this.meta.addTag({ name: 'robots', content: 'noindex' });
    this._tipoDocumentoPtesaClass = new TipoDocumentoPtesaClass(this._data);
    this.consultarTipoPin();
    this.consultarTipoNegocio();
    this.ConsultaInfoPin(this.pin, this.tipoPin);
    this.actionsBancolombiaForm = this._formBuilder.group({
      typeDocument: [this.TipoDocumento],
      idDocumentCurrent: [this.documentoIdentidad],
      pin: [this.pin],
    });
    this.devolucionTransferenciaForm = this._formBuilder.group({
      banco: ["", Validators.required],
      tipoDeCuenta: ["", Validators.required],
      numeroDeCuenta: ["", Validators.required],
      ReconfirmarNumeroDeCuenta: ['', Validators.required],
      tipoDocTitular: ["", Validators.required],
      numDocTitular: ["", [Validators.required, Validators.pattern('^[0-9^]*$')]],
      certificacionBancaria: ['', Validators.required]
    }, { validators: this.createCompareValidator2 });

    this.datosContacto = this._formBuilder.group({
      TipoDevolucion: ['', Validators.required],
      MotivoDevolucion: ['', Validators.required]
    });
    this.configurarParaNegocio();

    this._tipoDocumentoPtesaClass.get().subscribe((s: TipoDocumentoPtesaDTO[]) => {
      this._tipoDocumentoPtesaClass.set(s);
      this.tipoNit = s.filter(f => f.idTipoSisec == "4")![0];
      this.tiposDeDocumento = this._tipoDocumentoPtesaClass.getDocumentosByClienteCompra(this.clienteAnulacion);
    });

    this._data
      .obtenerListaBancos()
      .subscribe((x: BancosPinesOlimpia[]) => (this.bancos = x));

    /*Formulario Inical*/
    this.actionsBancolombiaForm
      .get('typeDocument')!
      .valueChanges.subscribe((x) => {
        this._utils.validarNumeroDocumento(
          this.actionsBancolombiaForm,
          'typeDocument',
          'idDocumentCurrent',
          this.camposValidacion,
          this.mensajesValidacion,
          this.clienteAnulacion
        );
      });
    /*Formulario devolucion transferncia*/
    this.devolucionTransferenciaForm
      .get('tipoDocTitular')!
      .valueChanges.subscribe((x) => {
        this._utils.validarNumeroDocumento(
          this.devolucionTransferenciaForm,
          'tipoDocTitular',
          'numDocTitular',
          this.camposValidacion,
          this.mensajesValidacion,
          this.clienteAnulacion
        );
      });
    this.analytics.label =
      'Compra ' +
      (this.clienteAnulacion == this.tipoCliente.CRC ? 'CRC' : 'CEA') +
      (window.location.host.includes('centro') ? ' Centro' : '');
  }

  private configurarParaNegocio() {
    this._route.params.subscribe((e: any) => {
      this.clienteAnulacion =
        e.sisec == 'CEA' ? TipoCliente.CEA : TipoCliente.CRC;
      this.formularioActivo = 1;
      this.actionsBancolombiaForm.setErrors(null);
      this.actionsBancolombiaForm.reset();
    });
  }

  /**
   * Remueve la máscara del valor solicitado
   * @param val Valor a desenmascarar
   */
  desenmascararValor(documentoIdentidad: any, TipoDocumento: any) {

    return this._utils.desenmascararValor(documentoIdentidad, TipoDocumento);
  }

  generarCodigoOTP(tokenCaptcha: string = '') {


    this.submitted = true;
    this.actionsBancolombiaForm.value.typeDocument = this.TipoDocumento
    this.actionsBancolombiaForm.value.idDocumentCurrent = this.documentoIdentidad
    this.actionsBancolombiaForm.value.pin = this.pin
    let datosFormulario: FormularioDevolucion = {
      formaDevolucion: this.formaDevolucion.value,
      operacionBancolombia: this.actionsBancolombiaForm.value,
      datosTransferencia: this.devolucionTransferenciaForm.value,
      tiposDocumento: this.tiposDeDocumento,
      nombreBanco: this.recuperarNombreBanco(),
      confirmaOperacion: false,
      tipoTramite: false,
    };

    let destinatario: Destinatario = {
      pin: this.pin
    }

    const bottomRef = this._bottomSheet.open(ConfirmarOperacionComponent, {
      data: datosFormulario,
    });
    bottomRef.afterClosed().subscribe(() => {
      if (bottomRef.componentInstance.data.confirmaOperacion) {

        this._data
          .envioOtp(destinatario,tokenCaptcha)
          .subscribe((envioOtp) => {
            if (envioOtp.idRespuesta==0) {
              this.openBottomSheet(0);
            } else {
              this._utils.abrirAlerta(envioOtp.mensajeRespuesta);
            }
          });
        this.success = true;
      }
    });
  }

  /**
   * Abre el dialogo para confirmar código y realizar operación solicitada.
   * @param idProceso Proceso de compra de Pin Olimpia
   */
  openBottomSheet(idProceso: number): void {
    const bottomRef = this._bottomSheet.open(ConfirmOTPComponent, {
      width: "328px"
    });
    bottomRef.componentInstance.otpCapturado.subscribe((otp: string) => {
      console.log("OTP capturado en el componente padre:", otp);

      let validarOtp: validacionOtp = {
        numeroDocumento: this.documentoIdentidad,
        tipoDocumento: this.TipoDocumento,
        pinComprado: this.pin,
        otp: otp
      }

      this._data.validacionOtp(validarOtp).subscribe(response => {

        if (response) {

          this.respuestaOtp = response;
          if (this.respuestaOtp.aprobado) {

            let transferenciaDatos: Transferencia | null = null;
            let bancoSeleccionado: string = this.recuperarNombreBanco();
            if (this.formaDevolucion.value == '2') {
              transferenciaDatos = {
                idBanco: +this.devolucionTransferenciaForm.get('banco')!.value,
                idTipoCuenta:
                  +this.devolucionTransferenciaForm.get('tipoDeCuenta')!.value,
                numeroCuenta:
                  this.devolucionTransferenciaForm.get('numeroDeCuenta')!.value,
                tipoIdentificacionTitular:
                  +this.devolucionTransferenciaForm.get('tipoDocTitular')!.value,
                numeroIdentificacionTitular: this.desenmascararValor(
                  String(
                    this.devolucionTransferenciaForm.get('numDocTitular')!.value
                  ).toUpperCase(),
                  +this.devolucionTransferenciaForm.get('tipoDocTitular')!.value
                ),
                nombreBanco: bancoSeleccionado,
                tipoCuenta:
                  this.devolucionTransferenciaForm.get('tipoDeCuenta')!.value,
              };
            }
            this.UploadCertificacionBancaria();

            /* Proceso de actualizacion del contacto.*/
            let infonueva: ActualizarDevolucionTransferenciaRequest = {
              idDevolucion: 0,/* Pendiente de devolucion*/
              idTipoIdentificacionDevolucion: (transferenciaDatos?.tipoIdentificacionTitular!) ? (transferenciaDatos?.tipoIdentificacionTitular!) : 0,
              numeroIdentificacionDevolucion: (transferenciaDatos?.numeroIdentificacionTitular!) ? transferenciaDatos?.numeroIdentificacionTitular! : "0",
              idBancoDevolucion: (transferenciaDatos?.idBanco!) ? (transferenciaDatos?.idBanco!) : 0,
              idTipoCuentaDevolucion: (transferenciaDatos?.idTipoCuenta!) ? (transferenciaDatos?.idTipoCuenta!) : 0,
              numeroCuentaDevolucion: (transferenciaDatos?.numeroCuenta!) ? transferenciaDatos?.numeroCuenta! : "0",
              idMotivoDevolucion: this.datosContacto.get('MotivoDevolucion')!.value
            };

            let actualizarDevolucion: CambiotipoDevolucion = {
              pin: this.infopinGeneral.Pin!,
              novedad: "Modificación efectivo a transferencia",
              usuarioReg: "MiLicencia",
              tipoSolicitud: this.datosContacto.get('TipoDevolucion')!.value,
              numeroIdentificacionSolicitante: this.documentoIdentidad,
              tipoIdentificacionSolicitante: this.TipoDocumento,
              idCliente: this.tipoNegocio,
              informacionNueva: infonueva
            }
            console.log(actualizarDevolucion);

            this._data.actualizarDevolucionEfectivoTransferencia(actualizarDevolucion).subscribe(x => {
              if (x) {
                /*Actualizacion positiva*/

                this._bottomSheet.open(SimpleInfoComponent, {
                  data: ['¡Operación realizada exitosamente!'],
                });
              }
              else {
                this._utils.abrirDialogo(
                  'Error desconocido. La actualización de tipo de devolución ha presentado un error.',
                  Icons.error
                );
              }
            });
          } else {
            this._utils.abrirDialogo(
              'Error desconocido. El otp registrado no corresponde.',
              Icons.error
            );
          }
        }
      });
    });
  }
  recuperarNombreBanco(): string {
    return this.bancos.find(
      (x: any) => +x.id == +this.devolucionTransferenciaForm.get('banco')!.value
    )?.nombre;
  }

  prueba() {
    let transferenciaDatos: Transferencia | null = null;
    let bancoSeleccionado: string = this.recuperarNombreBanco();
    if (this.formaDevolucion.value == '2') {
      transferenciaDatos = {
        idBanco: +this.devolucionTransferenciaForm.get('banco')!.value,
        idTipoCuenta:
          +this.devolucionTransferenciaForm.get('tipoDeCuenta')!.value,
        numeroCuenta:
          this.devolucionTransferenciaForm.get('numeroDeCuenta')!.value,
        tipoIdentificacionTitular:
          +this.devolucionTransferenciaForm.get('tipoDocTitular')!.value,
        numeroIdentificacionTitular: this.desenmascararValor(
          String(
            this.devolucionTransferenciaForm.get('numDocTitular')!.value
          ).toUpperCase(),
          +this.devolucionTransferenciaForm.get('tipoDocTitular')!.value
        ),
        nombreBanco: bancoSeleccionado,
        tipoCuenta:
          this.devolucionTransferenciaForm.get('tipoDeCuenta')!.value,
      };
    }
    this.UploadCertificacionBancaria();

    /* Proceso de actualizacion del contacto.*/
    let infonueva: ActualizarDevolucionTransferenciaRequest = {
      idDevolucion: 0,/* Pendiente de devolucion*/
      idTipoIdentificacionDevolucion: (transferenciaDatos?.tipoIdentificacionTitular!) ? (transferenciaDatos?.tipoIdentificacionTitular!) : 0,
      numeroIdentificacionDevolucion: (transferenciaDatos?.numeroIdentificacionTitular!) ? transferenciaDatos?.numeroIdentificacionTitular! : "0",
      idBancoDevolucion: (transferenciaDatos?.idBanco!) ? (transferenciaDatos?.idBanco!) : 0,
      idTipoCuentaDevolucion: (transferenciaDatos?.idTipoCuenta!) ? (transferenciaDatos?.idTipoCuenta!) : 0,
      numeroCuentaDevolucion: (transferenciaDatos?.numeroCuenta!) ? transferenciaDatos?.numeroCuenta! : "0",
      idMotivoDevolucion: this.datosContacto.get('MotivoDevolucion')!.value
    };

    let actualizarDevolucion: CambiotipoDevolucion = {
      pin: this.infopinGeneral.Pin!,
      novedad: "Prueba",
      usuarioReg: "MiLicencia",
      tipoSolicitud: this.datosContacto.get('TipoDevolucion')!.value,
      numeroIdentificacionSolicitante: this.documentoIdentidad,
      tipoIdentificacionSolicitante: this.TipoDocumento,
      idCliente: this.tipoNegocio,
      informacionNueva: infonueva

    }
    console.log(actualizarDevolucion);

    this._data.actualizarDevolucionEfectivoTransferencia(actualizarDevolucion).subscribe(x => {
      if ( !x) {
        this._utils.abrirAlerta("Se ha presentado un error al actualizar la devolución.");

      }
    });
  }

  validarPreDevolucion(tokenCaptcha: string = '') {

    let newNumber: string = '';
    let nuevoTipoDoc: number = 0;
    let envioOtpAccionBancolombia: EnvioOtpAccionBancolombia = {
      numeroIdentificacion: this.desenmascararValor(
        this.documentoIdentidad,
        +this.TipoDocumento
      ),
      nuevoTipoIdentificacion: nuevoTipoDoc,
      nuevoNumeroIdentificacion: newNumber,
      tipoIdentificacion: (
        this.TipoDocumento
      ),
      pinComprado: this.pin,
      operacionUsuarioBancolombia: this.accionBeneficiario.Anulacion,
      idCliente: this.clienteAnulacion,
      preValidacion: true,
    };
    let consultaEstadoDevolucion:ConsultaEstadoDevolucion = 
        {
          idCliente: this.clienteAnulacion.toString(),
          numeroIdentificacion: this.desenmascararValor(
            this.actionsBancolombiaForm.get('idDocumentCurrent')!.value,
            +this.actionsBancolombiaForm.get('typeDocument')!.value
          ),
          tipoIdentificacion: parseInt(this.actionsBancolombiaForm.get('typeDocument')!.value),
          pinComprado: this.actionsBancolombiaForm.get('pin')!.value,
          idOrigenCotizacion: OrigenCotizacion.Centro,
          idRunt:''
        }

    this._data
      .ConsultaEstadoDevolucion(consultaEstadoDevolucion,tokenCaptcha)
      .subscribe((resp: any) => {

        let respuestaAccion: any = resp;
        if (respuestaAccion) {
          this.enviarAnalytics('Devolución - Inicio de devolución', 1);
         
            let agenteDispersionRequest: AgenteDispersionRequest = {
              pin: this.actionsBancolombiaForm.value.pin,
              tipoPin: this.tipoPin,
            };
            this.CargaMotivosDevolucion(this.tipoPin.toString(), agenteDispersionRequest.tipoPin);
            this._data
              .getAgenteDispersionByPin(agenteDispersionRequest)
              .subscribe((r: AgenteDispersion) => {
                this.continuarFlujo(
                  r.idAgenteDispersion == 1
                    ? this.tiposDevolucionActivasPorPin.Todas
                    : this.tiposDevolucionActivasPorPin.Efectivo
                );
                this.ConsultaInfoPin(agenteDispersionRequest.pin, this.tipoPin);
              });
        } else {

          this._utils.abrirAlerta(respuestaAccion.texto ?? "Ha ocurrido un error en la consulta estado devolución. PIN no encontrado.");
          this.ConsultaInfoPin(this.pin, this.tipoPin);
        }
      });
  }

  continuarFlujo(tipoDevolucionActiva: any) {
    this.tipoDevolucionActiva = tipoDevolucionActiva;
    if (this.formularioActivo < 8) {
      this.formularioActivo += 1;
    }
  }

  enviarAnalytics(action: string, flujo: number) {
    //flujo 1 Inicio, 2 fin
    if (flujo === 1) {
      if (!this.analytics.inicio) {
        this.analytics.inicio = true;
        this._googleAnalyticsService.eventEmitter(
          'event',
          action,
          'click',
          this.analytics.label,
          0
        );
      }
    } else if (flujo === 2) {
      if (!this.analytics.fin) {
        this.analytics.fin = true;
        this._googleAnalyticsService.eventEmitter(
          'event',
          action,
          'click',
          this.analytics.label,
          0
        );
      }
    }
  }
  /* Metodos de devolucion*/
  CargaMotivosDevolucion(pin: string, tipopin: number) {
    let infopin: InfoPinSimple = {
      Pin: pin,
      tipoPin: tipopin
    }
    this._data.getMotivoDevolucionByTipoPin(infopin).subscribe(r => {

      if (r) {
        this.motivosDevolucion = r;
      }
    });
  }
  ConsultaInfoPin(pin: string, tipoPin: number) {

    let infopin: InfoPinSimple = {
      Pin: pin,
      tipoPin: tipoPin
    }
    this.infopinGeneral = infopin;

    this._data.consultarInformacionPinDevoluciones(this.infopinGeneral).subscribe(r => {

      if (r) {
        this.consultaInfoPin = r;

        /* Logica de patch en el formulario correspondiente*/
        this.datosContacto.patchValue({
          Nombres: this.consultaInfoPin.entidad.nombreTitular!,
          NumeroTelefono: this.consultaInfoPin.entidad.numeroContacto!,
          Email: this.consultaInfoPin!.entidad.correEletronico!
        });

      }
    });
  }
  editarInfoContacto() {
    this.editarInformacionContacto = false;

  }
  continuarDatosContacto() {

    let val = this.datosContacto.value;
    if (val.MotivoDevolucion != 0) {

      if (this.datosContacto.valid) {

        this.idMotivoDevolucion = val.MotivoDevolucion;


        this.formularioActivo = this.pasosFormulario.TipoTransferencia;


        if (this.tipoPin >= 1) {
          this.tipoDevolucionActiva = this.tiposDevolucionActivasPorPin.Transferencia;

        }

      }
    } else {
      this._utils.abrirAlerta("Debe seleccionar un motivo de devolución.");

    }

  }
  consultarTipoPin() {

    let ruta = this.route.url.toString();
    if (ruta.includes("CRC")) {

      this.tipoPin = 1;
    } else if (ruta.includes("CEA")) {

      this.tipoPin = 2;
    }
    this.consultarTipoNegocio();
  }

  consultarTipoNegocio() {

    let ruta = this.route.url.toString();
    if (ruta.includes("CRC")) {

      this.tipoNegocio = 3;
    } else if (ruta.includes("CEA")) {

      this.tipoNegocio = 8;
    } else if (ruta.includes("ARMAS")) {

      this.tipoNegocio = 9;
    }
  }

  uploadFile(event: any) {

    if (event.target.files.length > 0) {

      const fileupload = <File>event.target.files[0];
      if (fileupload.size <= 5120000) {

        if (fileupload.type == "application/pdf") {
          const reader = new FileReader();
          reader.readAsDataURL(fileupload);
          reader.onload = () => {
            let base64 = reader?.result!.toString();
            let file: FileToUpload = {
              fileName: this.infopinGeneral.Pin! + ".pdf",
              fileSize: fileupload.size.toString(),
              fileType: fileupload.type,
              lastModifiedTime: fileupload.lastModified,
              lastModifiedDate: new Date(fileupload.lastModified).toISOString(),
              fileAsBase64: base64
            }
            /* Cargamos el archivo para la implementacion necesaria.*/

            this.archivoCertificacionBancaria = file;

          }

        }
        else {
          /*archivo no es la extension necesaria*/
          event.target.value = null;
          this.devolucionTransferenciaForm.get('certificacionBancaria')?.reset();
          this._utils.abrirAlerta("El archivo que adjunto no es un archivo pdf.");
        }

      } else {
        /*archivo supera el peso solicitado*/
        event.target.value = null;
        this.devolucionTransferenciaForm.get('certificacionBancaria')?.reset();
        this._utils.abrirAlerta("El archivo excede el peso maximo permitido de 5 mb.");
      }
    }
  }
  DescargaCertificadoByPin(nombreArchivo: string) {


    this._data.getCertificadoByPin(nombreArchivo).subscribe(x => {
      if ( !x) {

        this._utils.abrirAlerta("No se ha encontrado el certificado bancario para el pin solicitado.");
      }
    });
  }
  UploadCertificacionBancaria() {

    if (this.archivoCertificacionBancaria != undefined) {
      this._data.guardarCertificado(this.archivoCertificacionBancaria).subscribe(x => {
        if ( !x) {
          this._utils.abrirAlerta("No se ha podido guardar el certificado bancario para el pin solicitado.");
        }
      });
    }


  }
  /* Validaciones de campos nuevos*/
  createCompareValidator(controlOne: string, controlTwo: string) {
    return () => {

      if (controlOne !== controlTwo) {

        return { match_error: 'Valores deben ser iguales' };
      }
      return null;
    };

  }
  createCompareValidator2(control: AbstractControl): ValidationErrors | null {

    if (control && control.get("numeroDeCuenta") && control.get("ReconfirmarNumeroDeCuenta")) {

      const cuenta1 = control.get("numeroDeCuenta")?.value;
      const cuenta2 = control.get("ReconfirmarNumeroDeCuenta")?.value;
      if (cuenta1 !== cuenta2) {
        return { match_error: "Valores deben ser iguales" }
      } else {
        return null
      }
    }
    return null;
  }

  imprimirAtributos() {

    console.log(this.TipoDocumento);
    console.log(this.documentoIdentidad);
    console.log(this.pin);

  }

  iniciarProceso(){

    this._recaptchaV3Service.execute('BeneficiarioBancolombia')
      .subscribe((token) => {
        this.validarPreDevolucion(token);
      },
      (error) => {
        this.validarPreDevolucion();
      });
  }

  iniciarProcesoEnvioOtp(){

    this._recaptchaV3Service.execute('envioOtp')
      .subscribe((token) => {
        this.generarCodigoOTP(token);
      },
      (error) => {
        this.generarCodigoOTP();
      });
  }

}
