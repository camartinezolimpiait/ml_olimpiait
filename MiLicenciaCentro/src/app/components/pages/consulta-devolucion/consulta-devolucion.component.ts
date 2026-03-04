import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TipoCliente } from 'src/app/enums/PinesOlimpia/TipoCliente';
import { ConsultaDevolucion } from 'src/app/interfaces/consulta-devolucion/ConsultaDevolucion';
import { ConsultaDevolucionRequest } from 'src/app/interfaces/consulta-devolucion/ConsultaDevolucionRequest';
import { ConsultaDevolucionRespuesta } from 'src/app/interfaces/consulta-devolucion/ConsultaDevolucionRespuesta';
import { DataService } from 'src/app/services/data/cotizador/data.service';
import { UtilService } from 'src/app/services/util/util.service';
import { ReCaptchaV3Service } from 'ng-recaptcha';
import { CamposValidacion } from './camposValidacion';
import { MensajesValidacion } from './mensajesValidacion';
import { Meta } from '@angular/platform-browser';
import { MatDialog } from '@angular/material/dialog';
import { ActualizacionDatosDevolucionComponent } from './actualizacion-datos-devolucion/actualizacion-datos-devolucion.component';
import { BancosPinesOlimpia } from 'src/app/interfaces/pago/PinesOlimpia/BancosPinesOlimpia';
import { ActualizacionInformacionDevolucion } from 'src/app/interfaces/consulta-devolucion/ActualizacionInformacionDevolucion';
import { RespuestaDevolucion } from 'src/app/interfaces/consulta-devolucion/RespuestaDevolucion';
import { Icons } from 'src/app/enums/Utils/Icons';
import { ConfirmOTPComponent } from './confirm-otp/confirm-otp.component';
import { TipoDocumentoPtesaDTO } from 'src/app/interfaces/cotizacion/TipoDocumentoPtesaDTO';
import { TipoDocumentoPtesaClass } from 'src/app/class/cotizador/tipoDocumentoPtesaClass';
import { CambiotipoDevolucion } from 'src/app/interfaces/cambio-tipo-devolucion/cambio-tipo-devolucion';
import { ActualizarDevolucionTransferenciaRequest } from 'src/app/interfaces/devoluciones/ActualizarDevolucionTransferenciaRequest';
import { validacionOtp } from 'src/app/interfaces/cambio-tipo-devolucion/validacionOtp';
import { RespuestaAcciones } from 'src/app/interfaces/pago/PinesOlimpia/RespuestaAccionBeneficiario';
import { Destinatario } from 'src/app/interfaces/cambio-tipo-devolucion/destinatario';
import { SimpleInfoComponent } from './simple-info/simple-info.component';

@Component({
  selector: 'app-consulta-devolucion',
  templateUrl: './consulta-devolucion.component.html',
  styleUrls: ['./consulta-devolucion.component.scss'],
})
export class ConsultaDevolucionComponent implements OnInit {
  consultaDevolucionForm!: FormGroup;
  camposValidacion: any = CamposValidacion;
  mensajesValidacion: any = MensajesValidacion;
  mostrarCambioTipoDevolucion = false;
  datosRecibidos: string = '';
  cliente!: number;
  tipoCliente!: number;
  tipodeNegocio!: string;
  documento!: string;
  enviarOtp = false;
  success = false;
  respuestaOtp!: RespuestaAcciones;
  tipoDocumento!: number;
  restriccionIntentos = 'Ha superado la cantidad de intentos permitidos'
  pinSelect!: string;
  tiposDeDocumento!: TipoDocumentoPtesaDTO[];
  consultaDevolucion: ConsultaDevolucion[] | null | undefined = null;
  captcha: boolean = false;
  bancos: any = [];
  consultaDevolucionRequest!: ConsultaDevolucionRequest;
  informacionDevolucion!: ActualizacionInformacionDevolucion;
  otp!: number;
  form!: FormGroup;
  _tipoDocumentoPtesaClass!: TipoDocumentoPtesaClass;
  tokenCaptcha: string = ''

  constructor(
    private readonly  _formBuilder: FormBuilder,
    private readonly _utils: UtilService,
    private readonly _route: ActivatedRoute,
    private readonly _data: DataService,
    private readonly _router: Router,
    private readonly _recaptchaV3Service: ReCaptchaV3Service,
    private readonly meta: Meta,
    private readonly _bottomSheet: MatDialog,
  ) { }

  ngOnInit() {
    this.meta.addTag({ name: 'robots', content: 'noindex' });
    this._tipoDocumentoPtesaClass = new TipoDocumentoPtesaClass(this._data);
    this.consultaDevolucionForm = this._formBuilder.group({
      tipoDocumento: ['', Validators.required],
      numDocumento: [
        '',
        [Validators.required, Validators.pattern('^[0-9^]*$')],
      ],
    });
    this.configurarParaNegocio();

    this.getTiposDocumentos();
    this.consultaDevolucionForm
      .get('tipoDocumento')!
      .valueChanges.subscribe((s) => {
        this._utils.validarNumeroDocumento(
          this.consultaDevolucionForm,
          'tipoDocumento',
          'numDocumento',
          this.camposValidacion,
          this.mensajesValidacion,
          TipoCliente.CRC
        );
      });
    this._data
      .obtenerListaBancos()
      .subscribe((x: BancosPinesOlimpia[]) => (this.bancos = x));
  }

  public validarCaptcha() {
    this._recaptchaV3Service.execute('consultarDevolucion').subscribe(
      (token) => {
        this.captcha = true;
        this.consultar(token);
        this.tokenCaptcha = token 
      },
      (error) => {
        this.captcha = false;
        this.consultar();
      }
    );
  }

  private configurarParaNegocio() {
    this._route.params.subscribe((e) => {
      let clienteAnt = this.cliente;
      this.cliente = e['sisec'] == 'CRC' ? TipoCliente.CRC : TipoCliente.CEA;
      if (clienteAnt != undefined && clienteAnt != this.cliente)
        this.reloadCurrentRoute();
    });
  }

  private getTiposDocumentos() {

    this._tipoDocumentoPtesaClass.get().subscribe((s: TipoDocumentoPtesaDTO[]) => {
      this._tipoDocumentoPtesaClass.set(s);
      this.tiposDeDocumento = this._tipoDocumentoPtesaClass.getDocumentosByClienteCompra(this.cliente);
    });
  }

  private consultar(tokenCaptcha: string = '') {
    if (this.consultaDevolucionForm.invalid) {
      this._utils.abrirAlerta('Por favor, complete todos los campos');
      return;
    }
    if (!this.captcha) {
      this._utils.abrirAlerta(
        'No se pudo completar la verificación captcha, intente más tarde.'
      );
      this.consultaDevolucion = null;
      this.reloadCurrentRoute();
      return;
    }
    this.consultaDevolucionRequest = {
      tipoDocumento: Number(
        this.consultaDevolucionForm.get('tipoDocumento')!.value
      ),
      documento: this.consultaDevolucionForm.get('numDocumento')!.value,
      tipoPin: this.cliente == TipoCliente.CRC ? 1 : 2,
    };
    this._data
      .devolucionByDocumento(this.consultaDevolucionRequest,tokenCaptcha)
      .subscribe((s: ConsultaDevolucionRespuesta) => {
        this.consultaDevolucion = null;
        if (!s.ok) {
          this._utils.abrirAlerta(s.mensaje);
          return;
        }
        if (s.data.length == 0) {
          this._utils.abrirAlerta('No se ha encontrado información.');
          return;
        }

        this.consultaDevolucion = s.data;

      });
  }

  reloadCurrentRoute() {
    let currentUrl = this._router.url;
    this._router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this._router.navigate([currentUrl]);
    });
  }

  public validarCaptchaFormulario(consultaDevolucion: ConsultaDevolucion) {
    this._recaptchaV3Service.execute('abrirFormularioDevolucion').subscribe(
      (token) => {
        this.captcha = true;
        this.abrirFormularioDevolucion(consultaDevolucion,'', null,token);
        this.tokenCaptcha = token
      },
      (error) => {
        this.captcha = false;
        this.consultar();
      }
    );
  }
  abrirFormularioDevolucion(consultaDevolucion: ConsultaDevolucion, mensaje: string, form: any,tokenCaptcha: string = '') {
    if (consultaDevolucion.permitirIntento) {
      const bottomRef = this._bottomSheet.open(ActualizacionDatosDevolucionComponent, {
        width: '650px',
        data: { ConsultaDevolucion: consultaDevolucion, Bancos: this.bancos, TiposDeDocumento: this.tiposDeDocumento, mensaje: mensaje, form: form },
      });
      bottomRef.afterClosed().subscribe(() => {
        if (bottomRef.componentInstance.isOk) {
          this.form = bottomRef.componentInstance.actualizacionDevolucionForm;
          this.informacionDevolucion = {
            transferencia: {
              tipoIdentificacionTitular: this.form.get('tipoDocTitular')!.value,
              numeroIdentificacionTitular: this.form.get('numDocTitular')!.value,
              idBanco: this.form.get('banco')!.value,
              nombreBanco: this.recuperarNombreBanco(this.form.get('banco')!.value),
              idTipoCuenta: this.form.get('tipoDeCuenta')!.value,
              tipoCuenta: this.form.get('tipoDeCuenta')!.value,
              numeroCuenta: this.form.get('numeroDeCuenta')!.value
            },
            consultaDevolucion: this.consultaDevolucionRequest,
            idCliente: this.consultaDevolucionRequest.tipoPin,
            pinComprado: consultaDevolucion.pin,
            auditoria: "",
            codigoOtp: ""
          }
          this._data.prevalidarActualizacionDevolucion(this.informacionDevolucion).subscribe((x: RespuestaDevolucion) => {
            if (x == null) {
              this.abrirFormularioDevolucion(consultaDevolucion, "Ha ocurrido un error, intente nuevamente", this.form);
            }
            else {
              if (x.idRespuesta != 0) {
                this.abrirFormularioDevolucion(consultaDevolucion, x.mensajeRespuesta, this.form);
              }
              else
              if (x.idRespuesta == 0)
              {
                this.informacionDevolucion.auditoria = x.auditoria;
                this.enviarOtp = true;
                let destinatario: Destinatario = {
                  pin: consultaDevolucion.pin,
                }

                this._data
                  .envioOtp(destinatario,tokenCaptcha)
                  .subscribe((envioOtp) => {

                    if (envioOtp.idRespuesta==0) {
                      this.openBottomSheet(consultaDevolucion);
                    } else {
                      this._utils.abrirAlerta(envioOtp.mensajeRespuesta);
                    }
                  });
                this.success = true;
                //this.openBottomSheet(consultaDevolucion);
              }
            }
            bottomRef.afterClosed().subscribe(() => {
              if (this.enviarOtp) {


              }
            });
          });
        }
      });
    }
    else {
      this._utils.abrirAlerta(
        'Ha superado la cantidad de intentos permitidos para actualizar la devolución.'
      );
    }
  }

  recuperarNombreBanco(idBanco: number): string {
    return this.bancos.find(
      (x: any) => +x.id == idBanco
    )?.nombre;
  }

  /**
   * Abre el dialogo para confirmar código y realizar operación solicitada.
   * @param idProceso Proceso de compra de Pin Olimpia
   */
  openBottomSheet(consultaDevolucion: ConsultaDevolucion): void {
    const bottomRef = this._bottomSheet.open(ConfirmOTPComponent, {
      width: '328px',
    });
    //bottomRef.afterClosed().subscribe(() => {
      //var codigoConfirmacionUsuario = bottomRef.componentInstance.data.otp;
      bottomRef.componentInstance.otpCapturado.subscribe((otp: string) => {
      console.log("OTP capturado en el componente padre:", otp);
      let infonueva: ActualizarDevolucionTransferenciaRequest = {
        idDevolucion: 0,
        idTipoIdentificacionDevolucion: this.form.get('tipoDocTitular')!.value,
        numeroIdentificacionDevolucion: this.form.get('numDocTitular')!.value,
        idBancoDevolucion: this.form.get('banco')!.value,
        idTipoCuentaDevolucion: this.form.get('tipoDeCuenta')!.value,
        numeroCuentaDevolucion: this.form.get('numeroDeCuenta')!.value,
        idMotivoDevolucion: 1
      };
      let actualizarDevolucion: CambiotipoDevolucion = {
        pin: consultaDevolucion.pin,
        novedad: "Actualización",
        usuarioReg: "MiLicencia",
        tipoSolicitud: 1,
        numeroIdentificacionSolicitante: "",
        tipoIdentificacionSolicitante: 0,
        idCliente: this.consultaDevolucionRequest.tipoPin,
        informacionNueva: infonueva
      }
      //this.informacionDevolucion.codigoOtp = String(codigoConfirmacionUsuario);
      let validarOtp: validacionOtp = {
        numeroDocumento: this.consultaDevolucionForm.get('numDocumento')!.value,
        tipoDocumento: this.consultaDevolucionForm.get('tipoDocumento')!.value,
        pinComprado: consultaDevolucion.pin,
        otp: otp
      }
      this._data.validacionOtp(validarOtp).subscribe(response => {
        this.respuestaOtp = response;
        if (this.respuestaOtp.aprobado) {
          this._data.actualizarDevolucionEfectivoTransferencia(actualizarDevolucion).subscribe(x => {
            if (!x) {
              this.abrirFormularioDevolucion(consultaDevolucion, "Ha ocurrido un error, intente nuevamente", this.form);
            }
            else {
              if (x) {

                this._bottomSheet.open(SimpleInfoComponent, {
                  data: ['¡Operación realizada exitosamente!'],
                });
              }
              else {
                this.reloadCurrentRoute();
                this._utils.abrirDialogo(x, Icons.success);
              }
            }
          });
        } else {
          this._utils.abrirDialogo(
            'Error desconocido. El otp registrado no corresponde.',
            Icons.error
          );
        }
      });
    });
  }




  tipoNegocio() {

    if (this.tipoCliente === 3) {
      this.tipodeNegocio = 'CRC';
    } else if (this.tipoCliente === 8) {
      this.tipodeNegocio = 'CEA'
    } else {
      this.tipodeNegocio = 'CRC-CEA';
    }
  }

  mostrarCambioTipo() {
    this.mostrarCambioTipoDevolucion = true; // Mostrar el componente
  }

  obtenerDatosPin(pinS: string) {
    // Aquí puedes realizar cualquier lógica que necesites con el valor 'pin'
    this.pinSelect = pinS;
    console.log('Se hizo clic en el botón para el pin:', pinS);
    this.obtenerDatos();
  }

  obtenerDatos() {

    this.documento = this.consultaDevolucionForm.get('numDocumento')!.value
    this.tipoDocumento = this.consultaDevolucionForm.get('tipoDocumento')!.value

    console.log(this.documento);
    console.log(this.tipoDocumento);
    console.log(this.pinSelect);
  }



  recibirDatos(datos: any) {
    this.datosRecibidos = datos;
    console.log(this.datosRecibidos);
  }
}
