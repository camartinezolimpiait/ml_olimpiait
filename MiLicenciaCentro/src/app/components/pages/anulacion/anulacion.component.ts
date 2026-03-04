import { Component, OnInit } from "@angular/core";
import {
  FormGroup,
  FormBuilder,
  Validators,
  FormControl,
  AbstractControl,
  ValidationErrors,
} from "@angular/forms";
import { MatDialog }from "@angular/material/dialog";
import { DataService } from "src/app/services/data/cotizador/data.service";
import { UtilService } from "src/app/services/util/util.service";
import {
  AccionBeneficiario,
  DescripcionSolicitudOperacionBancolombia,
} from "src/app/enums/PinesOlimpia/AccionBeneficiario";
import { TipoCuentaDevolucion } from "src/app/enums/PinesOlimpia/TipoCuentaDevolucion";
import { BancosPinesOlimpia } from "src/app/interfaces/pago/PinesOlimpia/BancosPinesOlimpia";
import { EnvioOtpAccionBancolombia } from "src/app/interfaces/pago/PinesOlimpia/EnvioOtpAccionBancolombia";
import { RespuestaAcciones } from "src/app/interfaces/pago/PinesOlimpia/RespuestaAccionBeneficiario";
import { TitulosPagina } from "src/app/enums/navegacionPagina/TitulosPagina";
import { AnulacionCompra } from "src/app/interfaces/pago/PinesOlimpia/Devoluciones/AnulacionCompra";
import { Transferencia } from "src/app/interfaces/pago/PinesOlimpia/Devoluciones/Transferencia";
import { FormularioDevolucion } from 'src/app/interfaces/pago/PinesOlimpia/Devoluciones/FormularioDevolucion';
import { TipoCliente } from 'src/app/enums/PinesOlimpia/TipoCliente';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmarOperacionComponent } from './confirmar-operacion/confirmar-operacion.component';
import { ConfirmOTPComponent } from './confirm-otp/confirm-otp.component';
import { SimpleInfoComponent } from './simple-info/simple-info.component';
import { Icons } from 'src/app/enums/Utils/Icons';
import { MensajesValidacion } from "./mensajesValidacion";
import { CamposValidacion } from "./camposValidacion";
import { Analytics } from "src/app/interfaces/Otros/Analytics";
import { GoogleAnalyticsService } from "src/app/services/data/googleAnalytics/google-analytics.service";
import { AgenteDispersion } from "src/app/interfaces/comun/AgenteDispersion";
import { AgenteDispersionRequest } from "src/app/interfaces/comun/AgenteDispersionRequest";
import { TiposDevolucionActivasPorPin } from "src/app/enums/PinesOlimpia/TiposDevolucionActivasPorPin";
import { TipoDocumentoPtesaDTO } from "src/app/interfaces/cotizacion/TipoDocumentoPtesaDTO";
import { TipoDocumentoPtesaClass } from "src/app/class/cotizador/tipoDocumentoPtesaClass";
import { FileToUpload } from "src/app/interfaces/devoluciones/FileToUpload";
import { InfoPinSimple } from "src/app/interfaces/devoluciones/InfoPinSimple";
import { DatosReferencia } from "src/app/interfaces/cotizacion/DatosReferencia";
import { MotivoDevolucionDto } from "src/app/interfaces/devoluciones/MotivoDevolucionDto";
import { ResponseDtoOfPtsaDatosContactoDtoYPlxipCl } from "src/app/interfaces/devoluciones/ResponseDtoOfPtsaDatosContactoDtoYPlxipCl";
import { ActualizarContacto } from "src/app/interfaces/devoluciones/ActualizarContacto";
import { Destinatario } from "src/app/interfaces/cambio-tipo-devolucion/destinatario";
import { validacionOtp } from "src/app/interfaces/cambio-tipo-devolucion/validacionOtp";
import { ReCaptchaV3Service } from 'ng-recaptcha';
import { ConsultaEstadoDevolucion } from "src/app/interfaces/devoluciones/ConsultaEstadoDevolucion";
import { OrigenCotizacion } from "src/app/enums/PinesOlimpia/OrigenCotizacion";

enum PasosFormulario {
  DatosCompra = 1,
  DatosUsuario,
  TipoTransferencia,
  TransferenciaBanco
}
@Component({
  selector: "app-anulacion",
  templateUrl: "./anulacion.component.html",
  styleUrls: ["./anulacion.component.scss"]
})
export class AnulacionComponent implements OnInit {
  tipoCuentaDevolucion = TipoCuentaDevolucion;
  accionBeneficiario = AccionBeneficiario;
  descripcionSolicitudOperacionBancolombia = DescripcionSolicitudOperacionBancolombia;
  pasosFormulario: any = PasosFormulario;
  formularioActivo!: number;
  actionsBancolombiaForm!: FormGroup;
  devolucionTransferenciaForm!: FormGroup;
  datosContacto!:FormGroup;
  success = false;
  otp!: number;
  submitted = false;
  bancos: any= [];
  tiposDeDocumento: TipoDocumentoPtesaDTO[] = [];
  tiposDeDocumentoDevoluciones: TipoDocumentoPtesaDTO[] = [];
  formaDevolucion: FormControl = new FormControl("", [Validators.required]);
  clienteAnulacion!: number;
  tipoCliente:any = TipoCliente;
  longitudDocumento: number = 11;
  tipoNit!: TipoDocumentoPtesaDTO;
  camposValidacion: any = CamposValidacion;
  mensajesValidacion: any = MensajesValidacion;
  analytics: Analytics = {
    inicio: false,
    fin: false,
    label: ''
  }
  tiposDevolucionActivasPorPin = TiposDevolucionActivasPorPin;
  tipoDevolucionActiva: number = 0;
  _tipoDocumentoPtesaClass!: TipoDocumentoPtesaClass;
      /* 
  *objetos nuevos de devoluciones
  */
  motivosDevolucion!:MotivoDevolucionDto[];
  consultaInfoPin!:ResponseDtoOfPtsaDatosContactoDtoYPlxipCl;
  editarInformacionContacto:boolean=false;
  idMotivoDevolucion:number = 0;
  datosReferencia!: DatosReferencia;
  tipoPin!:number;
  infopinGeneral!:InfoPinSimple;
  archivoCertificacionBancaria!:FileToUpload;
  camposIguales:boolean=true;
  tipoDocumentoDev!:number;
  nDocumentoDev!:string;
  respuestaOtp!: RespuestaAcciones;

  constructor(
    private readonly _formBuilder: FormBuilder,
    private readonly _data: DataService,
    private readonly _utils: UtilService,
    private readonly _bottomSheet: MatDialog,
    private readonly _route: ActivatedRoute,
    private readonly _googleAnalyticsService: GoogleAnalyticsService,
    private readonly route:Router,
    private readonly _recaptchaV3Service: ReCaptchaV3Service,
  ) { }
  
  avanzar(): void {
    if(this.pasosFormulario.DatosCompra)
    {
      this._recaptchaV3Service.execute('ConsultaEstadoDevolucion')
      .subscribe((token) => {
        this.validarPreDevolucion(token);
      },
      (error) => {
        this.validarPreDevolucion();
      });
    } else
    {
      if (this.formularioActivo < 8){
        this.formularioActivo += 1;
      }
    }
    this.validarTransferencia();
  }

  volver(): void {
    if (this.formularioActivo > 1)
      this.formularioActivo -= 1;
    this.eliminarNit();

    this.tipoDevolucionActiva = this.determineRefundType(); // Aquí restaura el valor de tipoDevolucionActiva
  }

  /**
   * Determina el tipo de devolucion para CEA y CRC
   * También se podria usar en continuarDatosContacto()
   * @returns El Id del tipo de devolución
   */
  determineRefundType(): number{
    const entity = this.consultaInfoPin?.entidad?.entidadRecaudadora;

    if (this.tipoPin == 1){
      switch(entity){
        case '5':
          return this.tiposDevolucionActivasPorPin.Efectivo;
        case '3':
        case '6':
        case '13': // Bancolombia
        case '16': // Daviplata
        case '17': // Bnpl
          return this.tiposDevolucionActivasPorPin.Transferencia;
      }
    }

    if(this.tipoPin == 2){
      switch(entity){
        case '7':
          return this.tiposDevolucionActivasPorPin.Efectivo;
        case '8':
        case '13': // Bancolombia
        case '16': // Daviplata
        case '17': // Bnpl
          return this.tiposDevolucionActivasPorPin.Transferencia;
      }
    }
    return this.tiposDevolucionActivasPorPin.Todas
  }

  validarTransferencia() {
    if(this.formaDevolucion.value == "2" && this.tiposDeDocumento.find(x => x.idTipoSisec == this.tipoNit.idTipoSisec) == undefined)
    {

    }
  }

  eliminarNit(){
    if(this.tipoNit != undefined) {
      this.tiposDeDocumento = (this.tiposDeDocumento.find(x => x.idTipoSisec == this.tipoNit.idTipoSisec)
      ? this.tiposDeDocumento.filter(x => x.idTipoSisec != this.tipoNit.idTipoSisec)
      : this.tiposDeDocumento);
    }
  }

  ngOnInit() {
    this._tipoDocumentoPtesaClass = new TipoDocumentoPtesaClass(this._data);
    this._utils.cambiarTituloPagina(TitulosPagina.Devolucion);
    this.consultarTipoPin();
    this.actionsBancolombiaForm = this._formBuilder.group({
      typeDocument: ["", Validators.required],
      idDocumentCurrent: ["", [Validators.required, Validators.pattern('^[0-9^]*$')]],
      pin: ["", [Validators.required, Validators.minLength(15)]]
    });
    this.devolucionTransferenciaForm = this._formBuilder.group({
      banco: ["", Validators.required],
      tipoDeCuenta: ["", Validators.required],
      numeroDeCuenta: ["", Validators.required],
      ReconfirmarNumeroDeCuenta:['', Validators.required],
      tipoDocTitular: ["", Validators.required],
      numDocTitular: ["", [Validators.required, Validators.pattern('^[0-9^]*$')]],
      certificacionBancaria:['',Validators.required]
    },{ validators: this.createCompareValidator2 });

    this.datosContacto = this._formBuilder.group({
      Nombres: ['', Validators.required],
      Email: ['',[Validators.required, Validators.email]],
      NumeroTelefono: ['', [Validators.required, Validators.minLength(10)]],
      MotivoDevolucion:['',Validators.required]
    });


    this.configurarParaNegocio();

    this._tipoDocumentoPtesaClass.get().subscribe((s: TipoDocumentoPtesaDTO[])=>{
      this._tipoDocumentoPtesaClass.set(s);
      this.tipoNit = s.filter(f => f.idTipoSisec == "4")![0];
      this.tiposDeDocumento = this._tipoDocumentoPtesaClass.getDocumentosByClienteCompra(this.clienteAnulacion);
      this.tiposDeDocumentoDevoluciones = this._tipoDocumentoPtesaClass.getDocumentosByClienteCompraDevoluciones(this.clienteAnulacion);
    });

    this._data.obtenerListaBancos().subscribe((x: BancosPinesOlimpia[]) => (this.bancos = x));
    /*Formulario Inical*/
    this.actionsBancolombiaForm.get("typeDocument")!.valueChanges.subscribe(x => {
     this._utils.validarNumeroDocumento(this.actionsBancolombiaForm, "typeDocument", "idDocumentCurrent", this.camposValidacion, this.mensajesValidacion, this.clienteAnulacion);
    })
    /*Formulario devolucion transferncia*/
    this.devolucionTransferenciaForm.get("tipoDocTitular")!.valueChanges.subscribe(x => {
      this._utils.validarNumeroDocumento(this.devolucionTransferenciaForm, "tipoDocTitular", "numDocTitular", this.camposValidacion, this.mensajesValidacion, this.clienteAnulacion);
    });
    this.analytics.label = 'Compra '
      + (this.clienteAnulacion == this.tipoCliente.CRC ? 'CRC' : 'CEA')
      + (window.location.host.includes("centro") ? ' Centro' : '');

      this.eliminarNit();
  }

  private configurarParaNegocio() {
    this._route.params.subscribe((e:any) => {
      this.clienteAnulacion = e.sisec == "CEA" ? TipoCliente.CEA : TipoCliente.CRC;
      this.formularioActivo = 1;
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

  iniciarProceso(){

    this._recaptchaV3Service.execute('EnvioOtp')
      .subscribe((token) => {
        this.generarCodigoOTP2(token);
      },
      (error) => {
        this.generarCodigoOTP2();
      });
  }

  private getDialogDocTypes(): TipoDocumentoPtesaDTO[] {
    let dialogDocTypes = [...this.tiposDeDocumento];
    let nitType: TipoDocumentoPtesaDTO | undefined;
    
    this._tipoDocumentoPtesaClass.get().subscribe((types: TipoDocumentoPtesaDTO[]) => {
      nitType = types.find(ty => ty.nombre?.toLowerCase().includes('nit'))
      if(nitType) dialogDocTypes.push(nitType);
    })
    
    return dialogDocTypes;
  }

  generarCodigoOTP(tokenCaptcha: string = '') {
    this.submitted = true;
    if (this.actionsBancolombiaForm.invalid) {
      this._utils.abrirAlerta("Por favor, complete todos los campos");
      return;
    }

    let newNumber: string = "";
    let nuevoTipoDoc: number = 0;
    if (this.formaDevolucion.value == "2" && this.devolucionTransferenciaForm.invalid) {
      this._utils.abrirAlerta(
        "Por favor, complete la información para la devolución"
      );
      return;
    }
    let envioOtpAccionBancolombia: EnvioOtpAccionBancolombia = {
      numeroIdentificacion: this.desenmascararValor(
        this.actionsBancolombiaForm.get("idDocumentCurrent")!.value,
        +this.actionsBancolombiaForm.get("typeDocument")!.value
      ),
      nuevoTipoIdentificacion: nuevoTipoDoc,
      nuevoNumeroIdentificacion: newNumber,
      tipoIdentificacion: parseInt(this.actionsBancolombiaForm.get("typeDocument")!.value),
      pinComprado: this.actionsBancolombiaForm.get("pin")!.value,
      operacionUsuarioBancolombia: this.accionBeneficiario.Anulacion,
      idCliente: this.clienteAnulacion,
      preValidacion:false
    };
    let datosFormulario: FormularioDevolucion = {
      formaDevolucion: this.formaDevolucion.value,
      operacionBancolombia: this.actionsBancolombiaForm.value,
      datosTransferencia: this.devolucionTransferenciaForm.value,
      tiposDocumento: this.tiposDeDocumento,
      nombreBanco: this.recuperarNombreBanco(),
      confirmaOperacion: false,
      tipoTramite: false
    }

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

    const bottomRef = this._bottomSheet.open(ConfirmarOperacionComponent, {
      data: datosFormulario
    });
    bottomRef.afterClosed().subscribe(() => {
      if (bottomRef.componentInstance.data.confirmaOperacion) {
        this._data
          .ConsultaEstadoDevolucion(consultaEstadoDevolucion,tokenCaptcha)
          .subscribe((resp:any) => {
            let respuestaAccion: any = resp;
            if (respuestaAccion.aprobado) {
              this.openBottomSheet(respuestaAccion.idProceso);
            } else {
              this._utils.abrirAlerta(respuestaAccion.texto?? "Ha ocurrido un error en la consulta estado devolución. PIN no encontrado.");
            }
          });
        this.success = true;
      }
    });
  }

  generarCodigoOTP2(tokenCaptcha: string = '') {
    this.submitted = true;
    if (this.actionsBancolombiaForm.invalid) {
      this._utils.abrirAlerta("Por favor, complete todos los campos");
      return;
    }

    let newNumber: string = "";
    let nuevoTipoDoc: number = 0;
    if (this.formaDevolucion.value == "2" && this.devolucionTransferenciaForm.invalid) {
      this._utils.abrirAlerta(
        "Por favor, complete la información para la devolución"
      );
      return;
    }
    let envioOtpAccionBancolombia: EnvioOtpAccionBancolombia = {
      numeroIdentificacion: this.desenmascararValor(
        this.actionsBancolombiaForm.get("idDocumentCurrent")!.value,
        +this.actionsBancolombiaForm.get("typeDocument")!.value
      ),
      nuevoTipoIdentificacion: nuevoTipoDoc,
      nuevoNumeroIdentificacion: newNumber,
      tipoIdentificacion: parseInt(this.actionsBancolombiaForm.get("typeDocument")!.value),
      pinComprado: this.actionsBancolombiaForm.get("pin")!.value,
      operacionUsuarioBancolombia: this.accionBeneficiario.Anulacion,
      idCliente: this.clienteAnulacion,
      preValidacion:false
    };
    let datosFormulario: FormularioDevolucion = {
      formaDevolucion: this.formaDevolucion.value,
      operacionBancolombia: this.actionsBancolombiaForm.value,
      datosTransferencia: this.devolucionTransferenciaForm.value,
      tiposDocumento: this.getDialogDocTypes(),
      nombreBanco: this.recuperarNombreBanco(),
      confirmaOperacion: false,
      tipoTramite: false
    }
    let destinatario: Destinatario = {
      pin: envioOtpAccionBancolombia.pinComprado
    }
    const bottomRef = this._bottomSheet.open(ConfirmarOperacionComponent, {
      data: datosFormulario
    });
    bottomRef.afterClosed().subscribe(() => {
      if (bottomRef.componentInstance.data.confirmaOperacion) {

debugger
        this._data
          .envioOtp(destinatario,tokenCaptcha)
          .subscribe((envioOtp) => {
            if (envioOtp.idRespuesta==0) {
              this._recaptchaV3Service.execute('BeneficiarioBancolombia')
              .subscribe((token) => {
                this.openBottomSheet2(0,envioOtpAccionBancolombia,token);
              });

            } else {
              this._utils.abrirAlerta(envioOtp.mensajeRespuesta);
            }
          });
        this.success = true;

        }});

  }

  openBottomSheet2(idProceso: number,envioOtpAccionBancolombia:EnvioOtpAccionBancolombia,tokenCaptcha: string = ''): void {
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
      otp: codigoConfirmacionUsuario.toString()
    }
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

    this._data.validacionOtp(validarOtp).subscribe(response => {

      if (response) {

        this.respuestaOtp = response;
        if (this.respuestaOtp.aprobado) {
          this._data
          .ConsultaEstadoDevolucion(consultaEstadoDevolucion,tokenCaptcha)
          .subscribe((resp:any) => {

            if(resp){
              if(resp.aprobado){
              let transferenciaDatos: Transferencia | null = null;
              let bancoSeleccionado: string = this.recuperarNombreBanco()
              if (this.formaDevolucion.value == "2") {
                transferenciaDatos = {
                  idBanco: +this.devolucionTransferenciaForm.get("banco")!.value,
                  idTipoCuenta: +this.devolucionTransferenciaForm.get("tipoDeCuenta")!.value,
                  numeroCuenta: this.devolucionTransferenciaForm.get("numeroDeCuenta")!.value,
                  tipoIdentificacionTitular: +this.devolucionTransferenciaForm.get("tipoDocTitular")!.value,
                  numeroIdentificacionTitular: this.desenmascararValor(
                      String(this.devolucionTransferenciaForm.get("numDocTitular")!.value).toUpperCase(),
                      +this.devolucionTransferenciaForm.get("tipoDocTitular")!.value
                  ),
                  nombreBanco: bancoSeleccionado,
                  tipoCuenta: this.devolucionTransferenciaForm.get("tipoDeCuenta")!.value,
                };
              }
              let datos: AnulacionCompra = {
                codigoConfirmacion: codigoConfirmacionUsuario.toString(),
                idProceso: idProceso,
                numeroDocumento: this.desenmascararValor(
                  String(this.actionsBancolombiaForm.get("idDocumentCurrent")!.value).toUpperCase(),
                  +this.actionsBancolombiaForm.get("typeDocument")!.value
                ),
                pinComprado: this.actionsBancolombiaForm.get("pin")!.value,
                tipoDocumento: +this.actionsBancolombiaForm.get("typeDocument")!.value,
                transferencia: transferenciaDatos,
                idCliente: this.clienteAnulacion,
                idMotivoDevolucion:this.idMotivoDevolucion
              };
              this._data
              .confirmarDevolucion(datos)
              .subscribe((x: RespuestaAcciones) => {
                  if (x.aprobado) {
                    this.enviarAnalytics((this.formaDevolucion.value == "2" ? 'Devolución - Confirmación transferencia' : 'Devolución - Confirmación efectivo'), 2);
                    this.UploadCertificacionBancaria();

                    let datosActualizar:ActualizarContacto={
                      Pin:this.infopinGeneral.Pin!,
                      Correo:this.consultaInfoPin!.entidad.correEletronico!,
                      Telefono:this.consultaInfoPin.entidad.numeroContacto!,
                    }
                    this._data.actualizarContacto(datosActualizar).subscribe(x =>{
                      if(x){
                        data: ["¡Operación realizada exitosamente!"," "]
                      }
                    });
                    this._bottomSheet.open(SimpleInfoComponent, {
                      data: ["¡Operación realizada exitosamente!", x.texto]
                    });
                    /* Envio de certificado bancario al ftp*/


                    /*Actualizar informacion del tramite*/
                  } else {
                    /*Error al confirmar la devolucion*/
                    this._utils.abrirDialogo(x.texto ?? "Error desconocido.", Icons.error);
                  }
              });
              

              }else{
                this._utils.abrirAlerta(resp.texto ?? "Ha ocurrido un error en la consulta estado devolución. PIN no encontrado.");
              }

            }else{
              this._utils.abrirAlerta("Ha ocurrido un error en la consulta estado devolución. PIN no encontrado.");
            }

          });

        }}
      });







    });
  }

  /**
   * Abre el dialogo para confirmar código y realizar operación solicitada.
   * @param idProceso Proceso de compra de Pin Olimpia
   */
  openBottomSheet(idProceso: number): void {
    const bottomRef = this._bottomSheet.open(ConfirmOTPComponent, {
      width: '328px',
      data: { otp: this.otp },
    });
    bottomRef.afterClosed().subscribe(() => {
      let codigoConfirmacionUsuario = bottomRef.componentInstance.data.otp;
      let transferenciaDatos: Transferencia | null = null;
      let bancoSeleccionado: string = this.recuperarNombreBanco()
      if (this.formaDevolucion.value == "2") {
        transferenciaDatos = {
          idBanco: +this.devolucionTransferenciaForm.get("banco")!.value,
          idTipoCuenta: +this.devolucionTransferenciaForm.get("tipoDeCuenta")!.value,
          numeroCuenta: this.devolucionTransferenciaForm.get("numeroDeCuenta")!.value,
          tipoIdentificacionTitular: +this.devolucionTransferenciaForm.get("tipoDocTitular")!.value,
          numeroIdentificacionTitular: this.desenmascararValor(
              String(this.devolucionTransferenciaForm.get("numDocTitular")!.value).toUpperCase(),
              +this.devolucionTransferenciaForm.get("tipoDocTitular")!.value
          ),
          nombreBanco: bancoSeleccionado,
          tipoCuenta: this.devolucionTransferenciaForm.get("tipoDeCuenta")!.value,
        };
      }
      let datos: AnulacionCompra = {
        codigoConfirmacion: codigoConfirmacionUsuario.toString(),
        idProceso: idProceso,
        numeroDocumento: this.desenmascararValor(
          String(this.actionsBancolombiaForm.get("idDocumentCurrent")!.value).toUpperCase(),
          +this.actionsBancolombiaForm.get("typeDocument")!.value
        ),
        pinComprado: this.actionsBancolombiaForm.get("pin")!.value,
        tipoDocumento: +this.actionsBancolombiaForm.get("typeDocument")!.value,
        transferencia: transferenciaDatos,
        idCliente: this.clienteAnulacion,
        idMotivoDevolucion:this.idMotivoDevolucion
      };
      this._data
      .confirmarDevolucion(datos)
      .subscribe((x: RespuestaAcciones) => {
          if (x.aprobado) {
            this.enviarAnalytics((this.formaDevolucion.value == "2" ? 'Devolución - Confirmación transferencia' : 'Devolución - Confirmación efectivo'), 2);
            this.UploadCertificacionBancaria();

             
            let datosActualizar:ActualizarContacto={
              Pin:this.infopinGeneral.Pin!,
              Correo:this.consultaInfoPin!.entidad.correEletronico!,
              Telefono:this.consultaInfoPin.entidad.numeroContacto!,
            }
            this._data.actualizarContacto(datosActualizar).subscribe(x =>{
              if(x){
                /*Accion resultante de actulizar el contacto */
              }});

            this._bottomSheet.open(SimpleInfoComponent, {
              data: ["¡Operación realizada exitosamente!", x.texto]
            });
            /*Envio de certificado bancario al ftp*/


            /*Actualizar informacion del tramite*/
          } else {
            /*Error al confirmar la devolucion*/
            this._utils.abrirDialogo(x.texto ?? "Error desconocido.", Icons.error);
          }
      });
    });
  }
  recuperarNombreBanco(): string {
    return this.bancos.find(
      (x: any) => +x.id == +this.devolucionTransferenciaForm.get("banco")!.value
    )?.nombre;
  }

  validarPreDevolucion(tokenCaptcha: string = '')
  {
    let newNumber: string = "";
    let nuevoTipoDoc: number = 0;
    let envioOtpAccionBancolombia: EnvioOtpAccionBancolombia = {
      numeroIdentificacion: this.desenmascararValor(
        this.actionsBancolombiaForm.value.idDocumentCurrent,
        +this.actionsBancolombiaForm.value.typeDocument
      ),
      nuevoTipoIdentificacion: nuevoTipoDoc,
      nuevoNumeroIdentificacion: newNumber,
      tipoIdentificacion: parseInt(this.actionsBancolombiaForm.value.typeDocument),
      pinComprado: this.actionsBancolombiaForm.value.pin,
      operacionUsuarioBancolombia: this.accionBeneficiario.Anulacion,
      idCliente: this.clienteAnulacion,
      preValidacion:true
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
        };
    this._data
    .ConsultaEstadoDevolucion(consultaEstadoDevolucion,tokenCaptcha)
    .subscribe((resp: any) => {
      let respuestaAccion: any = resp;
      if (respuestaAccion) {
        if(respuestaAccion.aprobado){
        this.enviarAnalytics('Devolución - Inicio de devolución', 1);
          let agenteDispersionRequest :AgenteDispersionRequest ={
            pin: this.actionsBancolombiaForm.value.pin,
            tipoPin: this.tipoPin
          };
          this.nDocumentoDev=envioOtpAccionBancolombia.numeroIdentificacion.toString();
          this.tipoDocumentoDev=envioOtpAccionBancolombia.tipoIdentificacion;
          this.CargaMotivosDevolucion(this.actionsBancolombiaForm.value.pin,agenteDispersionRequest.tipoPin);
          this._data.getAgenteDispersionByPin(agenteDispersionRequest).subscribe((r: AgenteDispersion)=>{
            this.continuarFlujo(r.idAgenteDispersion == 1 ? this.tiposDevolucionActivasPorPin.Todas : this.tiposDevolucionActivasPorPin.Efectivo);
            this.ConsultaInfoPin(agenteDispersionRequest.pin,this.tipoPin);

          });
        }else{
          this._utils.abrirAlerta(respuestaAccion.texto ?? "Ha ocurrido un error en la consulta estado devolución. PIN no encontrado.");
        }

      } else {
        this._utils.abrirAlerta("Ha ocurrido un error en la consulta estado devolución. PIN no encontrado.");
      }
    });
  }

  continuarFlujo(tipoDevolucionActiva: any){
    this.tipoDevolucionActiva = tipoDevolucionActiva;
    if (this.formularioActivo < 8){
      this.formularioActivo += 1;
    }
  }

  enviarAnalytics(action: string, flujo: number){
    /*flujo 1 Inicio, 2 fin*/
    if(flujo === 1){
      if(!this.analytics.inicio){
        this.analytics.inicio = true;
        this._googleAnalyticsService.eventEmitter('event', action, 'click', this.analytics.label, 0);
      }
    }
    else if(flujo === 2){
      if(!this.analytics.fin){
        this.analytics.fin = true;
        this._googleAnalyticsService.eventEmitter('event', action, 'click', this.analytics.label, 0);
      }
    }
  }
  
  /* Metodos de devolucion */
  CargaMotivosDevolucion(pin:string,tipopin:number){
    let infopin:InfoPinSimple={
      Pin: pin,
      tipoPin: tipopin
    }
    this._data.getMotivoDevolucionByTipoPin(infopin).subscribe(r=> {

      if(r){
        this.motivosDevolucion=r;


      }
    });
  }
  ConsultaInfoPin(pin:string,tipoPin:number){
    let infopin:InfoPinSimple={
      Pin: pin,
      tipoPin: tipoPin
    }
    this.infopinGeneral=infopin;

    this._data.consultarInformacionPinDevoluciones(this.infopinGeneral).subscribe(r=> {

      if(r){
        this.consultaInfoPin=r;
        /* Logica de patch en el formulario correspondiente*/

      this.datosContacto.patchValue({
       Nombres: this.truncarTexto(this.consultaInfoPin.entidad.nombreTitular),
       NumeroTelefono: this.consultaInfoPin.entidad.numeroContacto!,
       Email: this.consultaInfoPin.entidad.correEletronico!
      });

      }
    });
  }

  private truncarTexto(texto: string | null | undefined, maxLength: number = 100): string {
   if (!texto) return '';
   return texto.length > maxLength ? texto.substring(0, maxLength) : texto;
  }

  editarInfoContacto(){
    this.editarInformacionContacto=false;

  }
  continuarDatosContacto(){

    let val=this.datosContacto.value;
    if(val.motivosDevolucion != 0){
      if(this.datosContacto.valid){

        this.consultaInfoPin.entidad.numeroContacto= this.consultaInfoPin.entidad.numeroContacto!=val.NumeroTelefono?val.NumeroTelefono: this.consultaInfoPin.entidad.numeroContacto;
        this.consultaInfoPin.entidad.correEletronico=this.consultaInfoPin.entidad.correEletronico!=val.Email? val.Email: this.consultaInfoPin.entidad.correEletronico;
        this.idMotivoDevolucion=val.MotivoDevolucion;

        this.formularioActivo=this.pasosFormulario.TipoTransferencia;


        if(this.tipoPin==1){
          switch(this.consultaInfoPin.entidad.entidadRecaudadora){
            case "3":
                this.tipoDevolucionActiva=this.tiposDevolucionActivasPorPin.Transferencia;
                break;
            case "5":
                this.tipoDevolucionActiva=this.tiposDevolucionActivasPorPin.Efectivo;
                break;
            case "6":
                this.tipoDevolucionActiva=this.tiposDevolucionActivasPorPin.Transferencia;
                break;
            case "13": // Bancolombia
                this.tipoDevolucionActiva=this.tiposDevolucionActivasPorPin.Transferencia;
                break;
            case "16":// Daviplata
                this.tipoDevolucionActiva=this.tiposDevolucionActivasPorPin.Transferencia;
                break;
            case "17": // Bnpl
                this.tipoDevolucionActiva=this.tiposDevolucionActivasPorPin.Transferencia;
                break;

          }
        }
        if(this.tipoPin==2){
          switch(this.consultaInfoPin.entidad.entidadRecaudadora){
            case "8":/* PSE*/
              this.tipoDevolucionActiva=this.tiposDevolucionActivasPorPin.Transferencia;
              break;
            case "7":/* PSE*/
              this.tipoDevolucionActiva=this.tiposDevolucionActivasPorPin.Efectivo;
              break
            case "13": // Bancolombia
              this.tipoDevolucionActiva=this.tiposDevolucionActivasPorPin.Transferencia;
              break;
            case "16":// Daviplata
              this.tipoDevolucionActiva=this.tiposDevolucionActivasPorPin.Transferencia;
              break;
            case "17": // Bnpl
              this.tipoDevolucionActiva=this.tiposDevolucionActivasPorPin.Transferencia;
              break;
          }
        }

      }
    }else{
      this._utils.abrirAlerta("Debes seleccionar un motivo de devolución.");

    }

  }
  consultarTipoPin(){
    let ruta = this.route.url.toString();
    if(ruta.includes("CRC")){

      this.tipoPin=1;
    }else if(ruta.includes("CEA")){

      this.tipoPin=2;
    }
  }

  uploadFile(event:any){

      if(event.target.files.length>0){

        const fileupload=<File>event.target.files[0];
        if(fileupload.size<=5120000){

          if(fileupload.type == "application/pdf")
          {
            const reader= new FileReader();
            reader.readAsDataURL(fileupload);
            reader.onload= () =>{
              let base64=reader?.result!.toString();
              let file:FileToUpload={
                fileName: this.infopinGeneral.Pin!+"-"+this.tipoDocumentoDev.toString() +"-"+this.nDocumentoDev+".pdf",
                fileSize: fileupload.size.toString(),
                fileType: fileupload.type,
                lastModifiedTime: fileupload.lastModified,
                lastModifiedDate: new Date(fileupload.lastModified).toISOString(),
                fileAsBase64: base64
              }
              /* Cargamos el archivo para la implementacion necesaria.*/

              this.archivoCertificacionBancaria=file;

            }

          }
          else
          {
            /*archivo no es la extension necesaria*/
            event.target.value = null;
            this.devolucionTransferenciaForm.get('certificacionBancaria')?.reset();
            this._utils.abrirAlerta("El archivo que adjunto no es un archivo pdf.");
          }

        }else{
          /*archivo supera el peso solicitado*/
          event.target.value = null;
          this.devolucionTransferenciaForm.get('certificacionBancaria')?.reset();
        this._utils.abrirAlerta("El archivo excede el peso maximo permitido de 5 mb.");
        }
      }
    }
    DescargaCertificadoByPin(nombreArchivo:string){


      this._data.getCertificadoByPin(nombreArchivo).subscribe(x=>{
        if( !x){
          this._utils.abrirAlerta("No se ha encontrado el certificado bancario.");
        }
      });
    }
    UploadCertificacionBancaria(){

      if(this.archivoCertificacionBancaria!=undefined){
        this._data.guardarCertificado(this.archivoCertificacionBancaria).subscribe(x=>{
          if( !x){
            this._utils.abrirAlerta("No se ha podido guardar el certificado bancario.");
          }
        });
      }


    }
    /* Validaciones de campos nuevos*/
    createCompareValidator(controlOne: string, controlTwo: string) {
      return () => {

      if (controlOne !== controlTwo){

        return { match_error: 'Valores deben ser iguales' };
      }
      return null;
    };

  }
 createCompareValidator2(control: AbstractControl): ValidationErrors | null {

    if (control && control.get("numeroDeCuenta") && control.get("ReconfirmarNumeroDeCuenta")) {

      const cuenta1 = control.get("numeroDeCuenta")?.value;
      const cuenta2 = control.get("ReconfirmarNumeroDeCuenta")?.value;
      if(cuenta1 !== cuenta2){
        return { match_error:"Valores deben ser iguales" }
      }else{
        return null
      }
    }
    return null;
  }


}
