import { Component, OnInit } from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  Validators,
  FormControl,
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
import { TitulosPagina } from 'src/app/enums/navegacionPagina/TitulosPagina';
import { CambioDocumento } from 'src/app/interfaces/pago/PinesOlimpia/Devoluciones/CambioDocumento';
import { TipoCliente } from 'src/app/enums/PinesOlimpia/TipoCliente';
import { ActivatedRoute } from '@angular/router';
import { ConfirmarOperacionComponent } from './confirmar-operacion/confirmar-operacion.component';
import { ConfirmOTPComponent } from './confirm-otp/confirm-otp.component';
import { Icons } from 'src/app/enums/Utils/Icons';
import { MensajesValidacion } from './mensajesValidacion';
import { CamposValidacion } from './camposValidacion';
import { Analytics } from 'src/app/interfaces/Otros/Analytics';
import { GoogleAnalyticsService } from 'src/app/services/data/googleAnalytics/google-analytics.service';
import { ReCaptchaV3Service } from 'ng-recaptcha';
import { FormularioCambioBeneficiario } from 'src/app/interfaces/pago/PinesOlimpia/CambioBeneficiario/FormularioCambioBeneficiario';
import { TipoDocumentoPtesaDTO } from 'src/app/interfaces/cotizacion/TipoDocumentoPtesaDTO';
import { TipoDocumentoPtesaClass } from 'src/app/class/cotizador/tipoDocumentoPtesaClass';
import { Destinatario } from 'src/app/interfaces/cambio-tipo-devolucion/destinatario';
import { validacionOtp } from 'src/app/interfaces/cambio-tipo-devolucion/validacionOtp';
import { UsuarioCotizador } from 'src/app/interfaces/Otros/UsuarioCotizador';
import { ResponseCotizador } from 'src/app/interfaces/Otros/ResponseCotizador';
enum PasosFormulario {
  DatosCompra = 1,
  TipoTransferencia,
  TransferenciaBanco,
}
@Component({
  selector: 'app-cambio-beneficiario',
  templateUrl: './cambio-beneficiario.component.html',
})
export class CambioBeneficiarioComponent implements OnInit {
  tipoCuentaDevolucion = TipoCuentaDevolucion;
  accionBeneficiario = AccionBeneficiario;
  descripcionSolicitudOperacionBancolombia =
    DescripcionSolicitudOperacionBancolombia;
  pasosFormulario: any = PasosFormulario;
  formularioActivo!: number;
  actionsBancolombiaForm!: FormGroup;
  devolucionTransferenciaForm!: FormGroup;
  success = false;
  allowNewDocument = false;
  otp!: number;
  submitted = false;
  bancos: BancosPinesOlimpia[] = [];
  tiposDeDocumento: TipoDocumentoPtesaDTO[] = [];
  formaDevolucion: FormControl = new FormControl('', [Validators.required]);
  clienteAnulacion!: number;
  tipoCliente: any = TipoCliente;
  longitudDocumento: number = 11;
  tipoNit!: TipoDocumentoPtesaDTO;
  fechaNacimiento!: string;
  tipoDocUsuario!: number;
  nuevoTipoDocUsuario!: number;
  pinUsu!: string;
  edadUsu!: number;
  camposValidacion: any = CamposValidacion;
  mensajesValidacion: any = MensajesValidacion;
  analytics: Analytics = {
    inicio: false,
    fin: false,
    label: '',
  };
  _tipoDocumentoPtesaClass!: TipoDocumentoPtesaClass;
  respuestaOtp!: RespuestaAcciones;
  constructor(
    private readonly _formBuilder: FormBuilder,
    private readonly _data: DataService,
    private readonly _utils: UtilService,
    private readonly _bottomSheet: MatDialog,
    private readonly _route: ActivatedRoute,
    private readonly _googleAnalyticsService: GoogleAnalyticsService,
    private readonly _recaptchaV3Service: ReCaptchaV3Service
  ) {}
  /**
   * Avanza al siguiente paso del formulario si se cumplen las condiciones necesarias.
   * Si el formulario activo es menor a 8 y se permiten nuevos documentos, incrementa el formulario activo.
   */
  avanzar(): void {
    if (this.allowNewDocument && this.pasosFormulario.DatosCompra) {
      if (this.formularioActivo < 8) {
        this.formularioActivo += 1;
      }
    }
    this.validarTransferencia();
  }

  volver(): void {
    if (this.formularioActivo > 1) this.formularioActivo -= 1;
    this.eliminarNit();
  }
  /**
   * Valida si el tipo de documento NIT debe ser agregado a la lista de tipos de documento
   * dependiendo de la forma de devolución seleccionada.
   */
  validarTransferencia() {
    if (
      this.formaDevolucion.value == '2' &&
      this.tiposDeDocumento.find(
        (x) => x.idTipoSisec == this.tipoNit.idTipoSisec
      ) == undefined
    ) {
      if (this.tipoNit != undefined) this.tiposDeDocumento.push(this.tipoNit);
    }
  }

  /**
   * Elimina el tipo de documento NIT de la lista de tipos de documento
   * si ya existe, para evitar duplicados en el formulario.
   */
  eliminarNit() {
    this.tiposDeDocumento = this.tiposDeDocumento.find(
      (x) => x.idTipoSisec == this.tipoNit.idTipoSisec
    )
      ? this.tiposDeDocumento.filter(
          (x) => x.idTipoSisec != this.tipoNit.idTipoSisec
        )
      : this.tiposDeDocumento;
  }
  /**
   * Inicialización del componente.
   * Configura el título de la página, inicializa el formulario y obtiene los tipos de documento.
   */
  ngOnInit() {
    this._utils.cambiarTituloPagina(TitulosPagina.Devolucion);
    this._tipoDocumentoPtesaClass = new TipoDocumentoPtesaClass(this._data);

    this.actionsBancolombiaForm = this._formBuilder.group({
      typeDocument: ['', Validators.required],
      idDocumentCurrent: [
        '',
        [Validators.required, Validators.pattern('^[0-9^]*$')],
      ],
      nuevoTipoDocumento: [''],
      newNumberDocument: ['', [Validators.pattern('^[0-9^]*$')]],
      pin: ['', [Validators.required, Validators.minLength(15)]],
    });

    this.configurarParaNegocio();

    this._tipoDocumentoPtesaClass
      .get()
      .subscribe((s: TipoDocumentoPtesaDTO[]) => {
        this._tipoDocumentoPtesaClass.set(s);
        this.tipoNit = s.filter((f) => f.idTipoSisec == '4')![0];
        this.tiposDeDocumento =
          this._tipoDocumentoPtesaClass.getDocumentosByClienteCompra(
            this.clienteAnulacion
          );
      });

    //Formulario Inical
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
    this.actionsBancolombiaForm
      .get('nuevoTipoDocumento')!
      .valueChanges.subscribe((x) => {
        this._utils.validarNumeroDocumento(
          this.actionsBancolombiaForm,
          'nuevoTipoDocumento',
          'newNumberDocument',
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

  /**
   * Configura el componente para el negocio específico
   * Esta función suscribe a los parámetros de la ruta para determinar el tipo de cliente
   * y ajusta el formulario en consecuencia.
   * Si el trámite es de cambio de documento, se permite un nuevo documento.
   * Si el trámite es de anulación, se ajusta el formulario para no permitir un nuevo documento.
  */
  private configurarParaNegocio() {
    this._route.params.subscribe((e: any) => {
      this.clienteAnulacion =
        e.sisec == 'CEA' ? TipoCliente.CEA : TipoCliente.CRC;
      this.allowNewDocument =
        e.idTramite == this.accionBeneficiario.CambioDocumento.toString();
      this.formularioActivo = 1;
      this.cargarOpcionesFormulario();
      this.actionsBancolombiaForm.setErrors(null);
      this.actionsBancolombiaForm.reset();
    });
  }

  /**
   * Remueve la máscara del valor solicitado
   * @param val Valor a desenmascarar
   */
  desenmascararValor(val: string, doc: number) {
    return this._utils.desenmascararValor(val, doc);
  }

  /**
   * Cambia el formulario de acuerdo a la acción seleccionada (Cambio de documento, anulación)
   */
  cargarOpcionesFormulario(): void {
    if (this.allowNewDocument) {
      this.actionsBancolombiaForm
        .get('nuevoTipoDocumento')!
        .setValidators([Validators.required]);
      this.actionsBancolombiaForm
        .get('newNumberDocument')!
        .setValidators([Validators.required]);
    } else {
      this.actionsBancolombiaForm.get('nuevoTipoDocumento')!.clearValidators();
      this.actionsBancolombiaForm.get('newNumberDocument')!.clearValidators();
    }
  }
  /**
   * Validar los datos del formulario y llama al funnción generarCodigoOTP.
   * Si el formulario es inválido, muestra una alerta al usuario.
   * @param tokenCaptcha Token de reCAPTCHA, opcional
  */
  generarCodigoOTP(tokenCaptcha: string = '') {

    const valorPIN = this.actionsBancolombiaForm.get("pin")?.value;

    this.submitted = true;
    if (this.actionsBancolombiaForm.invalid) {
      this._utils.abrirAlerta(
        'Por favor, complete todos los campos requeridos'
      );
      return;
    }
    let newNumber: string;
    let nuevoTipoDoc: number;
    newNumber = this.desenmascararValor(
      this.actionsBancolombiaForm.get('newNumberDocument')!.value,
      +this.actionsBancolombiaForm.get('nuevoTipoDocumento')!.value
    );
    nuevoTipoDoc =
      +this.actionsBancolombiaForm.get('nuevoTipoDocumento')!.value;

    let envioOtpAccionBancolombia: EnvioOtpAccionBancolombia = {
      numeroIdentificacion: this.desenmascararValor(
        this.actionsBancolombiaForm.get('idDocumentCurrent')!.value,
        +this.actionsBancolombiaForm.get('typeDocument')!.value
      ),
      nuevoTipoIdentificacion: nuevoTipoDoc,
      nuevoNumeroIdentificacion: newNumber,
      tipoIdentificacion: parseInt(
        this.actionsBancolombiaForm.get('typeDocument')!.value
      ),
      pinComprado: typeof valorPIN === 'string' ? valorPIN.trim() : '',
      operacionUsuarioBancolombia: this.accionBeneficiario.CambioDocumento,
      idCliente: this.clienteAnulacion,
      preValidacion: false,
    };
    let datosFormulario: FormularioCambioBeneficiario = {
      operacionBancolombia: this.actionsBancolombiaForm.value,
      tiposDocumento: this.tiposDeDocumento,
      confirmaOperacion: false,
      tipoTramite: this.allowNewDocument,
    };
    let destinatario: Destinatario = {
      pin: envioOtpAccionBancolombia.pinComprado,
    };
    const bottomRef = this._bottomSheet.open(ConfirmarOperacionComponent, {
      data: datosFormulario,
    });
    bottomRef.afterClosed().subscribe(() => {
      if (bottomRef.componentInstance.data.confirmaOperacion) {
        this._data
          .envioOtp(destinatario, tokenCaptcha)
          .subscribe((envioOtp) => {
            if (envioOtp.idRespuesta == 0) {
              this.validTokenOTP(0, envioOtpAccionBancolombia, tokenCaptcha);
            } else if (envioOtp.idRespuesta == -5) {
              this._utils.abrirAlerta('No se encontró información de contacto');
            } else {
              this._utils.abrirAlerta(
                'Ha ocurrido un error en el servicio de envio Otp'
              );
            }
          });
        this.success = true;
      }
    });
  }
  /*
   * Abrir el segundo bottom sheet
   * @param idProceso ID del proceso
   * @param envioOtpAccionBancolombia Datos del envío OTP
   * @param tokenCaptcha Token de reCAPTCHA
   * @returns void
   */

  openBottomSheet2(
    idProceso: number,
    envioOtpAccionBancolombia: EnvioOtpAccionBancolombia,
    tokenCaptcha: string
  ): void {
    const bottomRef = this._bottomSheet.open(ConfirmOTPComponent, {
      width: '328px',
      data: { otp: this.otp },
    });
    bottomRef.afterClosed().subscribe(() => {
      let codigoConfirmacionUsuario = bottomRef.componentInstance.data.otp;
      let validarOtp: validacionOtp = {
        numeroDocumento: envioOtpAccionBancolombia.numeroIdentificacion,
        tipoDocumento: envioOtpAccionBancolombia.tipoIdentificacion,
        pinComprado: envioOtpAccionBancolombia.pinComprado,
        otp: codigoConfirmacionUsuario.toString(),
      };

      this._data.validacionOtp(validarOtp).subscribe((response) => {

        const valorPIN = this.actionsBancolombiaForm.get("pin")?.value;

        if (response) {
          this.respuestaOtp = response;
          if (this.respuestaOtp.aprobado) {
            this._data
              .ConsultaEstadoCambioBeneficiario(
                envioOtpAccionBancolombia,
                tokenCaptcha
              )
              .subscribe((resp) => {
                let respuestaAccion: any = resp;
                if (respuestaAccion.aprobado) {
                  this.enviarAnalytics('Corrección de documento - Inicio', 1);
                  let nuevoNumeroDoc: string = '';
                  let nuevoTipoDoc: number = 0;
                  nuevoNumeroDoc = this.desenmascararValor(
                    this.actionsBancolombiaForm.get('newNumberDocument')!.value,
                    +this.actionsBancolombiaForm.get('nuevoTipoDocumento')!
                      .value
                  );
                  nuevoTipoDoc =
                    +this.actionsBancolombiaForm.get('nuevoTipoDocumento')!
                      .value;
                  let datosVerificacion: CambioDocumento = {
                    codigoConfirmacion: codigoConfirmacionUsuario.toString(),
                    actualNumeroDocumento: this.desenmascararValor(
                      String(
                        this.actionsBancolombiaForm.get('idDocumentCurrent')!
                          .value
                      ).toUpperCase(),
                      +this.actionsBancolombiaForm.get('typeDocument')!.value
                    ),
                    actualTipoDocumento:
                      +this.actionsBancolombiaForm.get('typeDocument')!.value,
                    nuevoNumeroDocumento: nuevoNumeroDoc,
                    nuevoTipoDocumento: nuevoTipoDoc,
                    pinComprado: typeof valorPIN === 'string' ? valorPIN.trim() : '',
                    idProceso: idProceso,
                    idCliente: this.clienteAnulacion,
                  };
                  this._data
                    .confirmarCambioDocumento(datosVerificacion)
                    .subscribe((x: RespuestaAcciones) => {
                      if (x != null && x?.aprobado) {
                        this.enviarAnalytics(
                          'Corrección de documento - Fin',
                          2
                        );
                        this._utils.abrirDialogo(x.texto, Icons.success);
                      } else {
                        let messageError =
                          'Se ha presentado un error en proceso de Cambio Beneficiario, si el problema persiste comuníquese con Soporte Interno';
                        this._utils.abrirAlerta(
                          x?.texto ?? messageError
                        );
                      }
                    });
                } else {
                  this._utils.abrirAlerta(respuestaAccion.texto);
                }
              });
          } else {
            this._utils.abrirAlerta(
              'El código ingresado es incorrecto, por favor vuelva a intentarlo'
            );
          }
        }
      });
    });
  }

  /**
   * Abre el dialogo para confirmar código y realizar operación solicitada.
   * @param idProceso Proceso de compra de Pin Olimpia
   */
  openBottomSheet(idProceso: number): void {

    const valorPIN = this.actionsBancolombiaForm.get('pin')!.value.trimp();

    const bottomRef = this._bottomSheet.open(ConfirmOTPComponent, {
      width: '328px',
      data: { otp: this.otp },
    });
    bottomRef.afterClosed().subscribe(() => {
      let codigoConfirmacionUsuario = bottomRef.componentInstance.data.otp;
      let nuevoNumeroDoc: string = '';
      let nuevoTipoDoc: number = 0;
      nuevoNumeroDoc = this.desenmascararValor(
        this.actionsBancolombiaForm.get('newNumberDocument')!.value,
        +this.actionsBancolombiaForm.get('nuevoTipoDocumento')!.value
      );
      nuevoTipoDoc =
        +this.actionsBancolombiaForm.get('nuevoTipoDocumento')!.value;
      let datosVerificacion: CambioDocumento = {
        codigoConfirmacion: codigoConfirmacionUsuario.toString(),
        actualNumeroDocumento: this.desenmascararValor(
          String(
            this.actionsBancolombiaForm.get('idDocumentCurrent')!.value
          ).toUpperCase(),
          +this.actionsBancolombiaForm.get('typeDocument')!.value
        ),
        actualTipoDocumento:
          +this.actionsBancolombiaForm.get('typeDocument')!.value,
        nuevoNumeroDocumento: nuevoNumeroDoc,
        nuevoTipoDocumento: nuevoTipoDoc,
        pinComprado:typeof valorPIN === 'string' ? valorPIN.trim() : '',
        idProceso: idProceso,
        idCliente: this.clienteAnulacion,
      };
      this._data
        .confirmarCambioDocumento(datosVerificacion)
        .subscribe((x: RespuestaAcciones) => {
          if (x.aprobado) {
            this.enviarAnalytics('Corrección de documento - Fin', 2);
            this._utils.abrirDialogo(x.texto, Icons.success);
          } else {
            this._utils.abrirAlerta(x.texto);
          }
        });
    });
  }
  /**
   * Enviar eventos de Google Analytics
   * @param action Acción del evento
   * @param flujo Flujo del evento (1: Inicio, 2: Fin)
   * @returns void
   */
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
  /*
  /**
   * Iniciar el proceso de cambio de beneficiario
   * Este ejecuta el reCAPTCHA v3 para validar la acción y luego llama al método generarCodigoOTP.
   * Si ocurre un error al ejecutar el reCAPTCHA, se llama a generarCodigoOTP sin el token.
   * @returns void
   */
  iniciarProceso() {
    this._recaptchaV3Service.execute('BeneficiarioBancolombia').subscribe(
      (token) => {
        this.generarCodigoOTP(token);
      },
      (error) => {
        this.generarCodigoOTP();
      }
    );
  }

  /**
   * Validar el token OTP y abrir el bottom sheet de confirmación
   * @param idProceso Identificador del proceso de compra de Pin Olimpia
   * @param envioOtpAccionBancolombia Objeto que contiene la información del envío de OTP
   * @param tokenCaptcha Token de reCAPTCHA v3, opcional
   * @returns void
  */
  validTokenOTP(
    idProceso: number,
    envioOtpAccionBancolombia: EnvioOtpAccionBancolombia,
    tokenCaptcha: string = ''
  ) {
    this._recaptchaV3Service.execute('BeneficiarioBancolombia').subscribe(
      (token) => {
        this.openBottomSheet2(idProceso, envioOtpAccionBancolombia, token);
      },
      (error) => {
        this.openBottomSheet2(
          idProceso,
          envioOtpAccionBancolombia,
          tokenCaptcha
        );
      }
    );
  }
  /**
   * Validar la prevalidación del usuario antes de iniciar el proceso de cambio de documento
   * Este método verifica el PIN del usuario y calcula su edad para determinar si el cambio de documento es válido.
   * Si el cambio es válido, se inicia el proceso de cambio de documento.
   * Si el cambio no es válido, se muestra un mensaje de alerta al usuario.
   * @returns void
   */
  prevalidacionUsuario() {

    const valorPIN = this.actionsBancolombiaForm.get("pin")?.value;

    (this.tipoDocUsuario =
      this.actionsBancolombiaForm.get('typeDocument')!.value);
      (this.nuevoTipoDocUsuario =
        this.actionsBancolombiaForm.get('nuevoTipoDocumento')!.value);

    let usuarioCotizador: UsuarioCotizador = {
      tipoIdentificacion: this.actionsBancolombiaForm.get('typeDocument')!.value,
      numeroIdentificacion: this.actionsBancolombiaForm.get('idDocumentCurrent')!.value,
      pin: typeof valorPIN === 'string' ? valorPIN.trim() : ''
    };

    this._data.ConsultaExistePin(usuarioCotizador)
      .subscribe((x: ResponseCotizador) => {
        if (x.id > 0) {
          this.fechaNacimiento = x.fechaNacimiento!.toString();
          console.log(this.fechaNacimiento);
          this._data
            .calcularEdadAspirante(this.fechaNacimiento)
            .subscribe((y: number) => {
              this.edadUsu = y;
              if (
                this.tipoDocUsuario == 2 &&
                this.nuevoTipoDocUsuario == 3 &&
                this.edadUsu > 18
              ) {
                this._utils.abrirAlerta(
                  "No es posible cambiar el tipo de documento 'Cédula de extranjería' a 'Tarjeta de identidad' siendo mayor de edad."
                );
              } else if (
                this.tipoDocUsuario == 2 &&
                this.nuevoTipoDocUsuario == 1 &&
                this.edadUsu < 18
              ) {
                this._utils.abrirAlerta(
                  "No es posible cambiar el tipo de documento 'Cédula de extranjería' a 'Cédula de ciudadanía' siendo menor de edad."
                );
              } else if (
                this.tipoDocUsuario == 3 &&
                this.nuevoTipoDocUsuario == 1 &&
                this.edadUsu < 18
              ) {
                this._utils.abrirAlerta(
                  "No es posible cambiar el tipo de documento 'Tarjeta de identidad' a 'Cédula de ciudadanía' siendo menor de edad."
                );
              } else if (
                this.tipoDocUsuario == 1 &&
                this.nuevoTipoDocUsuario == 3 &&
                this.edadUsu > 18
              ) {
                this._utils.abrirAlerta(
                  "No es posible cambiar el tipo de documento 'Cédula de ciudadanía' a 'Tarjeta de identidad' siendo mayor de edad."
                );
              } else {
                this.success = true;
                this.iniciarProceso();
              }
            });
        } else if (x.id == 0) {
          this._utils.abrirAlerta(`${x.mensaje || ''}, ${x.mensajeDetallado ||  'Por favor verifique la información suministrada y vuelva a intentarlo'}`);

        } else {
          this._utils.abrirAlerta('Ha ocurrido un error en el servicio');
        }
      });
  }
}
