import { Component, OnInit, Input, Output, EventEmitter, Inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { PagoPin } from 'src/app/interfaces/compraPin/PagoPin';
import { EstadoSandboxWompi, MedioPago, MediosPago, TipoPago } from 'src/app/enums/PinesOlimpia/TipoPago';
import { TipoPersona } from 'src/app/enums/PinesOlimpia/TipoPersona';
import { TycComponent } from '../tyc/tyc.component';
import { InformacionPagoBancolombia, ReferenciaPagoBancolombia } from 'src/app/interfaces/pago/PinesOlimpia/ReferenciaPagoBancolombia';
import { ReferenciaGenerada } from 'src/app/interfaces/pago/PinesOlimpia/ReferenciaGenerada';
import { Cuotas } from 'src/app/interfaces/pago/PinesOlimpia/Cuota';
import { CostoCuota } from 'src/app/interfaces/compraPin/CostoCuota';
import { TipoCliente } from 'src/app/enums/PinesOlimpia/TipoCliente';
import { Tramite } from 'src/app/enums/Tramite';
import { DataService } from 'src/app/services/data/cotizador/data.service';
import { UtilService } from 'src/app/services/util/util.service';
import { Payer } from 'src/app/interfaces/pago/SecurePay/Payer';
import { CrearOrden, Orden } from 'src/app/interfaces/pago/TuPago/Orden';
import { TuPagoService } from 'src/app/services/data/tu-pago/tu-pago.service';
import { DOCUMENT } from '@angular/common';
import { Compra } from 'src/app/interfaces/pago/SecurePay/Compra';
import { SecurePayService } from 'src/app/services/data/secure-pay/secure-pay.service';
import { OrigenPin } from 'src/app/enums/OrigenPin';
import { ParametrosMensaje } from 'src/app/interfaces/notificacion/ParametrosMensaje';
import { GoogleAnalyticsService } from 'src/app/services/data/googleAnalytics/google-analytics.service';
import { SeleccionarReferenciaTransaccionCuotaRequest } from 'src/app/interfaces/pago/PinesOlimpia/SeleccionarReferenciaTransaccionCuotaRequest';
import moment from 'moment';
import { MatDialog } from '@angular/material/dialog';
import { ConvenioResumenObj } from 'src/app/interfaces/compraPin/ConvenioResumenObj';
import { TipoReferencia } from 'src/app/enums/TipoReferencia';
import { ParametrosBancolombia } from 'src/app/interfaces/pago/ParametrosBancolombia';
import { Convenio } from 'src/app/interfaces/cotizacion/Convenio';
import { CompraTipoCliente } from 'src/app/interfaces/pago/SecurePay/CompraTipoCliente';
import { TokenAceptacion } from 'src/app/interfaces/compraPin/TokenAceptacion';
import { ReferenciaBancolombiaWompi } from 'src/app/interfaces/pago/Wompi/ReferenciaBancolombiaWompi';
import { Data } from 'src/app/interfaces/pago/Wompi/Data';
import { TramiteWompi } from 'src/app/interfaces/pago/Wompi/TramiteWompi';
import { Categoria } from 'src/app/interfaces/cotizacion/Categoria';
import { Cuota } from 'src/app/interfaces/pago/Wompi/Cuota';
import { ResponseReferenciaWompi } from 'src/app/interfaces/pago/Wompi/ResponseReferenciaWompi';
import { environment } from 'src/environments/environment';
import { getUrlResumen } from 'src/app/services/util/api-milicencia.util';
import { OrigenCotizacion } from 'src/app/enums/PinesOlimpia/OrigenCotizacion';
import { EntidadMensaje } from 'src/app/interfaces/Otros/EntidadMensaje';
import { ReCaptchaV3Service } from 'ng-recaptcha';
import { AutorizacionDaviplata } from 'src/app/interfaces/pago/PinesOlimpia/AutorizacionDaviplata';
import { ConfirmarOtpDaviplataComponent } from './confirmar-otp-daviplata/confirmar-otp-daviplata.component';
import { ValidacionRespuestaDaviplata } from 'src/app/interfaces/pago/Daviplata/ValidacionRespuestaDaviplata';
import { Router } from '@angular/router';
import { MatDialogRef } from '@angular/material/dialog';
import { EncryptService } from 'src/app/services/data/encrypt/encrypt.service';
import { RequestNotificationSuccess } from 'src/app/interfaces/compraPin/RequestNotificationSuccess';
import { tipoDocumento } from 'src/app/interfaces/pago/FacturacionElectronica/TipoDocumentoResponse';
import { TipoPersonaFE } from 'src/app/enums/PinesOlimpia/TipoPersonaFE';
@Component({
  selector: 'app-confirmar-compra',
  templateUrl: './confirmar-compra.component.html',
  styleUrls: ['./confirmar-compra.component.scss']
})
export class ConfirmarCompraComponent implements OnInit {
  compraPinForm!: FormGroup;
  tipoRecaudo: any = TipoPago
  mediosPago: MedioPago[] = MediosPago
  tipoPersona: any = TipoPersona;
  cuotaSeleccionada!: CostoCuota | null | undefined;
  tipoCliente: any = TipoCliente;
  tramites: any = Tramite;
  referenciaGeneradaPinesOlimpia: any = null;
  referenciaGenerada!: string;
  reintentos: number = 0;
  tipoRecaudoCtrlTmp: FormControl = new FormControl();
  idGenerarReferencia: string = "btn-gen-ref-";
  origenPin: any = OrigenPin;
  origenCotizacion: any = OrigenCotizacion;
  parametrosMensaje!: ParametrosMensaje;
  principal: boolean = true;
  validacionManual: boolean = false;
  convenioResumenObj: ConvenioResumenObj[] = [];
  idOrigenPin: number = 0;
  tipoReferencia: any = TipoReferencia;
  tipoReferenciaActual: number = 0;
  daviplata: number = 16;
  pdfWompi: string = "";
  acceptanceToken: string =""
  totalPayment: number = 0;
  firstPayment: number = 0;
  otherPayment: number = 0;
  correoDaviplata!: ResponseReferenciaWompi;
  autorizacionDaviplataActu!: AutorizacionDaviplata ;
  permitirReenvio: boolean = false;
  dialogRefActu?: MatDialogRef<ConfirmarOtpDaviplataComponent> | null;
  corresponsalDato!: string;
  referenciaWompi!:ReferenciaBancolombiaWompi;
  closeWithResend: boolean = false;
  tipoPersonaFE:any = TipoPersonaFE;

  @Input() pagoPin: any;
  @Output() pagoPinVolverEvent = new EventEmitter<boolean>();
  @Output() cambiarVistaEvent = new EventEmitter<number>();
  @Output() aplicaFEConfirmEvent = new EventEmitter<boolean>();
  constructor(
    private readonly _formBuilder: FormBuilder,
    private readonly _matDialog: MatDialog,
    private readonly _data: DataService,
    private readonly _utils: UtilService,
    private readonly _tuPagoService: TuPagoService,
    private readonly _securePayService: SecurePayService,
    private readonly _googleAnalyticsService: GoogleAnalyticsService,
    public _encriptService: EncryptService,
    public router: Router,
    @Inject(DOCUMENT) private readonly document: Document,
    private readonly _recaptchaV3Service: ReCaptchaV3Service,
  ) {
  }

  ngOnInit(): void {
    this.inicializarFormulario();
    if (this.pagoPin.plantillas != undefined) {
      this.validarOpcionesPago();
    }
    else {
      this.obtenerPlantilla(() => {
        this.validarOpcionesPago();
      });
    }

    if (this.pagoPin.cuotas > 0) {
      this.totalPayment = this.pagoPin.costoCuotas[this.pagoPin.cuotas - 1].valorTotal;
      this.firstPayment = this.pagoPin.costoCuotas[this.pagoPin.cuotas - 1].primeraCuota;
      this.otherPayment = this.pagoPin.costoCuotas[this.pagoPin.cuotas - 1].valorCuota;
    } else {
      this.totalPayment = this.pagoPin.valorDiscriminadoCotizacion.valorTotal;
    }
  }

  private validarOpcionesPago() {
    if (this.pagoPin.tipoPagoEfectivo == null) {
      this.validarPagosDigitales();
    }
    else {
      this.pagoEfectivo();
    }
  }

  private pagoEfectivo() {
    this.idOrigenPin = this.pagoPin.tipoPagoEfectivo;
    let convenioSeleccionado = this.pagoPin.conveniosPagoEfectivo.find((f: Convenio) => f.idOrigenPin == this.pagoPin.tipoPagoEfectivo)

    if (convenioSeleccionado != undefined && convenioSeleccionado.generaPin!) {
      this.tipoReferenciaActual = this.tipoReferencia.Efectivo;
    }
    else {
      this.tipoReferenciaActual = this.tipoReferencia.SinGenerar;
    }
  }

  private validarPagosDigitales(){
    switch(this.pagoPin.tipoRecaudoCtrl){
      //Bancolombia
      case 13:
        this.tipoReferenciaActual = TipoReferencia.BancolombiaWompi
        this.cargarTycWompi();
        this.pagoElectronico();
      break;
      case 14:
        this.pagoElectronico();
      break;
      case 15:
        this.pagoElectronico();
      break;
      case 16:
        this.tipoReferenciaActual = TipoReferencia.DaviplataWompi
        this.pagoElectronico();
        break;
      default:
        this.pagoElectronico();
      break;
    }
  }

  private cargarTycWompi(){
    this._data.ObtenerTokenAceptacion(this.pagoPin.clienteCompra).subscribe((result: TokenAceptacion) => {
      this.pdfWompi = result.permalink;
      this.acceptanceToken =  result.acceptance_token;
    });
  }

  private pagoElectronico() {
    this.idOrigenPin = this.origenPin.PinesOlimpia;
    if (this.pagoPin.tipoRecaudoCtrl == this.tipoRecaudo.PSE && this.pagoPin.tipoBancoPSE != null) {
      this.tipoReferenciaActual = TipoReferencia.Electronica;
    }
  }

  private inicializarFormulario() {
    this.compraPinForm = this._formBuilder.group({
      tyc: [null, Validators.required],
      tycWompi:[null, Validators.required],
    });
    this.compraPinForm.valueChanges.subscribe(values => {
      if (this.pagoPin.tipoRecaudoCtrl == 13) {
        if(values.tyc && values.tycWompi){
          this.validacionManual = true;
        } else{
            this.validacionManual=false;
        }
      } else{
        if(values.tyc){
          this.validacionManual = true;
        } else{
            this.validacionManual=false;
        }
      }
    });
    this.tipoRecaudoCtrlTmp.setValue(this.pagoPin.tipoRecaudoCtrl);
    this.idGenerarReferencia = this.idGenerarReferencia + (this.pagoPin.clienteCompra == this.tipoCliente.CEA ? "cea-in-miperfil" : "crc-in-miperfil");
  }

  /**
  * Recupera sigla de acuerdo al tipo de documento seleccionado, para ser enviado a ACH
  * @param typeDocumentId Tipo de documento seleccionado
  */
  obtenerCodigoACHdelTipoDocumento(typeDocumentId: number) {
    const typeSelected = this.pagoPin.tiposDeDocumento?.find(
      (x: any) => x.idTipoSisec == typeDocumentId
    );
    return typeSelected?.codigoACH;
  }

  abrirTyC(e: any): void {
    e.preventDefault();
    this._matDialog.open(TycComponent, { autoFocus: false });
  }

  volver() {
    this.pagoPinVolverEvent.emit(true);
  }

 obtenerTipoIdentificacion(pagoPin: PagoPin): string | null {
  if (!pagoPin.checkFacturaElectronicaResumen) return null;

  const comprador = pagoPin.compradorFE;
  if (!comprador) return null;

  switch (comprador.tipoPersona) {
    case this.tipoPersonaFE.Natural:
      return comprador.numDocumento?.toString() ?? '';
    case this.tipoPersonaFE.Juridica:
      return comprador.nit ?? null;
    default:
      return null;
  }
}

obtenerNit():number{
  const nit = Number(this.pagoPin.tiposDeDocumentoFE.find((tipod: tipoDocumento)=> tipod.codigoACH === 'NIT').idTipoSisec)
  return nit;
}


  pagarReferenciaBancolombiaWompi(){
    /*debugger*/
    this.validacionManual = false;
    let data: Data = {
      AcceptanceToken: this.acceptanceToken,
      Apellidos: (this.pagoPin.usuario.apellido + (this.pagoPin.usuario?.segundoApellido!=undefined ? (' '+this.pagoPin.usuario?.segundoApellido):'')),
      Categoria: this.pagoPin.categoria1,
      CorreoElectronico: this.pagoPin.usuario.correo,
      CostoExtraRecaudo: 0,
      Cuotas: this.setCoutas(),
      DispersionAliado: this.pagoPin.valorDiscriminadoCotizacion.banco,
      DispersionAns: this.pagoPin.valorDiscriminadoCotizacion.ansv,
      DispersionCrc: this.pagoPin.valorDiscriminadoCotizacion.crc,
      DispersionSicov: this.pagoPin.valorDiscriminadoCotizacion.sicov,
      EstadoWompi: EstadoSandboxWompi.APPROVED,
      FechaNacimiento: moment(this.pagoPin.usuario.fechaNacimiento).format('YYYY-MM-DD'),
      IdConvenio: this.obtenerConvenioMedioPago(), /*Modificar 13*/
      IdOrigenCotizacion: this.origenCotizacion.Centro,
      IdRunt: '' + this.pagoPin.centroSeleccionado.codigoRUNT,
      Nombres: (this.pagoPin.usuario.nombre + (this.pagoPin.usuario?.segundoNombre != undefined ? (' ' + this.pagoPin.usuario?.segundoNombre) : '' )),
      NumeroIdentificacion: (this.pagoPin.usuario.numDocumento) + '',
      Sexo: +(this.pagoPin.usuario.genero),
      TelefonoContacto: ''+(this.pagoPin.usuario.celular),
      TipoIdentificacion: Number(this.pagoPin.usuario.tipoDocumento),
      Tramite: this.setTramite(),
      UrlRedireccion: this.setUrlRedireccion(),
      ValorTransaccion: this.pagoPin.valorDiscriminadoCotizacion.valorTotal,
      tipoIdentificacionComprador: this.pagoPin.comprador ? this.pagoPin.comprador.tipoDocumento : null,
      numeroIdentificacionComprador: this.pagoPin.comprador ? this.pagoPin.comprador.numDocumento : null,
    };

    // Agregar campos de facturación electrónica si aplica
if (this.pagoPin.checkFacturaElectronicaResumen) {
  Object.assign(data, {
    apellidosFacturacion: this.pagoPin.compradorFE?.tipoPersona === this.tipoPersonaFE.Natural ? this.pagoPin.compradorFE?.apellido ?? '' : '',
    nombresFacturacion: this.pagoPin.compradorFE?.tipoPersona === this.tipoPersonaFE.Natural ? this.pagoPin.compradorFE?.nombre ?? '' : '',
    correoFacturacion: this.pagoPin.compradorFE?.correo ?? '',
    nombreComercialFacturacion: this.pagoPin.compradorFE?.tipoPersona === this.tipoPersonaFE.Juridica ? this.pagoPin.compradorFE?.nombreComercial ?? '' : '',
    numeroIdentificacionFacturacion: this.obtenerTipoIdentificacion(this.pagoPin),
    razonSocialFacturacion: this.pagoPin.compradorFE?.tipoPersona === this.tipoPersonaFE.Juridica ? this.pagoPin.compradorFE?.razonSocial ?? '' : '',
    tipoIdentificacionFacturacion: this.pagoPin.compradorFE?.tipoPersona === this.tipoPersonaFE.Natural
      ? Number(this.pagoPin.compradorFE.tipoDocumento) ?? 0
      : this.obtenerNit(),
    tipoPersonaFacturacion: this.pagoPin.compradorFE?.tipoPersona ?? 0,
  });
}

    this.referenciaWompi = {
      IdCliente: this.pagoPin.clienteCompra,
      Data: data,
    };

    this._recaptchaV3Service.execute('GenerarReferenciaBancolombiaWompi')
    .subscribe((token) => {
      this._data.GenerarReferenciaBancolombiaWompi(this.referenciaWompi,token).subscribe((x: ResponseReferenciaWompi) => {
        if (x?.respuesta.mensajeRespuestaField == "Ok") {
          /*debugger*/
          if (data.IdConvenio == this.daviplata) {
            this.correoDaviplata = x;
            let autorizacionDaviplata: AutorizacionDaviplata = {
              idCliente: this.pagoPin.clienteCompra,
              fechaTransaccion: "",
              idConvenio: this.obtenerConvenioMedioPago(),
              idRunt: this.pagoPin.centroSeleccionado.codigoRUNT,
              numeroAutorizacion: 0,
              numeroIdentificacion: (this.pagoPin.usuario.numDocumento) + '',
              numeroPin: x.respuesta.pinField,
              tipoIdentificacion: this.pagoPin.usuario.tipoDocumento,
              valorTransaccion: this.pagoPin.valorDiscriminadoCotizacion.valorTotal,
            }

            if(this.permitirReenvio){
              debugger
              this.autorizacionDaviplataActu = autorizacionDaviplata;
              this.reenviarCodigoDaviplata(this.dialogRefActu!)
            }else{
            this.validarDaviplata(autorizacionDaviplata);
          }
          } else {
            this.document.location.href = x?.urlRedireccion;

            let notificationSuccess :RequestNotificationSuccess={
              PinField:x?.respuesta.pinField,
              TotalTransaccion:this.referenciaWompi.Data.ValorTransaccion.toString(),
              Cuotas:this.referenciaWompi.Data.Cuotas.length
            }
            this._data.ConstruirCorreoWompi(notificationSuccess).subscribe((y: EntidadMensaje) => {
            });


          }
        } else {
          if (data.IdConvenio == this.daviplata) {
            if (x?.respuesta.codigoRespuestaField == -1) {
              this._utils.abrirAlerta('La referencia no se generó correctamente');
            }
            else if (x?.respuesta.codigoRespuestaField == 500) {
              this._utils.abrirAlerta('El saldo de daviplata es menor al solicitado para la compra.');
            } else if (x?.respuesta.codigoRespuestaField == 17) {
              this._utils.abrirAlerta('Algo salió mal, por favor, vuelva a intentarlo. O seleccione otro método de pago.');
              this.pagoPinVolverEvent.emit(true);
            }
            else if (x?.respuesta.codigoRespuestaField == 1304) {
              this._utils.abrirAlerta('Se cargó un documento de identidad que no tiene asociado ningún Daviplata.');
              this.pagoPinVolverEvent.emit(true);
            } else if (x?.respuesta.codigoRespuestaField == 321) {
              this._utils.abrirAlerta('Se cargó un documento de identidad que no tiene asociado ningún Daviplata.');
              this.pagoPinVolverEvent.emit(true);
            }

          } else {
            this._utils.abrirAlerta('La referencia no se generó correctamente');
          }
        }
      });
    },
    (error) => {
      this._utils.abrirAlerta('Ha ocurrido una problematica con la generación del captcha.');
    });


  }

  reenviarCodigoDaviplata(dialogRef: MatDialogRef<ConfirmarOtpDaviplataComponent>): void{
    this._utils.abrirAlerta('Código OTP reenviado.');
    const autorizacionDaviplata = this.autorizacionDaviplataActu;
    dialogRef.componentInstance.actualizarData(autorizacionDaviplata);
  }

  validarDaviplata(autorizacionDaviplata: AutorizacionDaviplata) {
/*debugger*/
    const dialogRef = this._matDialog.open(ConfirmarOtpDaviplataComponent, {
      backdropClass: 'custom-dialog-backdrop',
      panelClass: 'custom-dialog-panel',
      data: autorizacionDaviplata
    });

    this.dialogRefActu = dialogRef
    dialogRef.componentInstance.onClosePopup.subscribe((event: ValidacionRespuestaDaviplata) => {

   let pin
      if (this.permitirReenvio) {
        pin = this.autorizacionDaviplataActu.numeroPin
      }else{
      pin = autorizacionDaviplata.numeroPin
    }
      let error = event.respuesta.mensajeRespuesta;
      if (event.success) {
        debugger
        this._utils.abrirAlerta('Compra realizada con éxito.');
        if (event.respuesta.codigoRespuesta == 0) {

          let notificationSuccess :RequestNotificationSuccess={
            PinField:this.correoDaviplata.respuesta.pinField,
            TotalTransaccion:this.referenciaWompi.Data.ValorTransaccion.toString(),
            Cuotas:this.referenciaWompi.Data.Cuotas.length
          }
          this._data.ConstruirCorreoWompi(notificationSuccess).subscribe((y: EntidadMensaje) => {
          });
          let hash = "{\"Aprobado\":true,\"Pin\":\"" + pin + "\",\"Error\":\"\"}"
          hash = this._encriptService.encryptUsingAES256(hash).replace(/\//g, "_");
          this.router.navigate(['/resumen/recaudo/' + hash]);
        }
        else {
          this._utils.abrirAlerta('Algo salio mal con la compra, por favor vuelva intentarlo');
          let hash = "{\"Aprobado\":false,\"Pin\":\"" + pin + "\",\"Error\":\"" + error + "\"}"
          hash = this._encriptService.encryptUsingAES256(hash).replace(/\//g, "_");
          this.router.navigate(['/resumen/recaudo/' + hash]);
        }
      } else if (!event.success) {
        if (event.respuesta.codigoRespuesta == -2) {
          this.permitirReenvio = true;
          this.pagarReferenciaBancolombiaWompi();
        }
      }
    });

    dialogRef.afterClosed().subscribe(() => {
        this.closeWithResend = dialogRef.componentInstance.closeWithResend;
        this.validacionManual = true;

        if(this.closeWithResend){
          this.dialogRefActu = null;
          this.permitirReenvio = false;
        }
    });

    dialogRef.afterOpened().subscribe(() => {

        setTimeout(() => {
          if (dialogRef.componentInstance) {
            dialogRef.componentInstance.actualizarData(autorizacionDaviplata);
          }
        }, 1000);
      });

  }


  setCoutas(){
    let totalCuotas: Cuota[] = [];

    if (this.pagoPin.cuotas == 0) {
      totalCuotas.push({
        DispersionAliado: 0,
        ValorTransaccion: 0
      });
    } else {
      this.cuotaSeleccionada = this.pagoPin.costoCuotas
        .find((x: any) => x.numeroCuotas == this.pagoPin.cuotas);

      for (let i = 0; i < +this.pagoPin.cuotas - 1; i++) {
        totalCuotas.push({
          DispersionAliado: this.pagoPin.valorDiscriminadoCotizacion.banco,
          ValorTransaccion: Math.round(Number(this.cuotaSeleccionada?.valorCuota)),
        });
      }
    }

    return totalCuotas;
  }

  setTramite(){
    let tramite: TramiteWompi = {
      Categoria1:  0,
      Categoria2: 0,
      CodigoCategoria1: this.pagoPin.categoria1,
      CodigoCategoria2: this.pagoPin.categoria2,
      IdTramite1: +this.pagoPin.tipoTramite,
      IdTramite2: +this.pagoPin.tipoTramite2,
    };

    if (this.pagoPin.clienteCompra == this.tipoCliente.CEA) {
      tramite.Categoria1 = this.pagoPin.categoriasCea
        .find((x: Categoria) => x.codigo == this.pagoPin.categoria1)?.idCategoria ?? 0;

        tramite.Categoria2 = this.pagoPin.categoriasCea
        .find((x: Categoria) => x.codigo == this.pagoPin.categoria2)?.idCategoria ?? 0;
    }else{
      tramite.Categoria1 = this.pagoPin.categoriasCrc
        .find((x: Categoria) => x.codigo == this.pagoPin.categoria1)?.idCategoria ?? 0;

        tramite.Categoria2 = this.pagoPin.categoriasCrc
        .find((x: Categoria) => x.codigo == this.pagoPin.categoria2)?.idCategoria ?? 0;
    }

    return tramite;
  }

  setUrlRedireccion(){
    if (this.pagoPin.tipoRecaudoCtrl == 1) {
  return getUrlResumen() + "/resumen/";
    } else if(this.tipoReferenciaActual == TipoReferencia.BancolombiaWompi){
  return getUrlResumen() + "/resumen/recaudo/";
    } else {
  return getUrlResumen() + "/resumen/";
    }
  }

  pagarConPinesOlimpia(isPSE: boolean, origenPines?: number) {

    if (this.pagoPin.conveniosPagoEfectivo && this.pagoPin.conveniosPagoEfectivo.length > 0) {
      this.corresponsalDato = this.pagoPin.conveniosPagoEfectivo.find((x: Convenio) => x.idOrigenPin==this.pagoPin.tipoPagoEfectivo) ?this.pagoPin.conveniosPagoEfectivo.find((x: Convenio) => x.idOrigenPin==this.pagoPin.tipoPagoEfectivo).convenioNombre: "Corresponsal Bancario";
    }
    let fechaNacimiento = moment(this.pagoPin.usuario.fechaNacimiento).format("YYYY-MM-DD");
    let informacionPago: InformacionPagoBancolombia = {
      apellidos: this.pagoPin.usuario.apellido,
      nombres: this.pagoPin.usuario.nombre,
      correoElectronico: this.pagoPin.usuario.correo,
      dispersionAliado: this.pagoPin.valorDiscriminadoCotizacion.banco,
      dispersionAns: this.pagoPin.valorDiscriminadoCotizacion.ansv,
      dispersionCrc: this.pagoPin.valorDiscriminadoCotizacion.crc,
      dispersionSicov: this.pagoPin.valorDiscriminadoCotizacion.sicov,
      valorTransaccion: this.pagoPin.valorDiscriminadoCotizacion.valorTotal,
      fechaNacimiento: fechaNacimiento,
      idRunt: this.pagoPin.centroSeleccionado.codigoRUNT,
      tipoIdentificacion: +this.pagoPin.usuario.tipoDocumento,
      numeroIdentificacion: this.pagoPin.usuario.numDocumento + "",
      sexo: +this.pagoPin.usuario.genero,
      telefonoContacto: "" + this.pagoPin.usuario.celular,
      idConvenio: this.obtenerConvenioMedioPago()
    };
    // Agregar campos de facturación electrónica si aplica
    if (this.pagoPin.checkFacturaElectronicaResumen) {
      Object.assign(informacionPago, {
        apellidosFacturacion: this.pagoPin.compradorFE?.tipoPersona === this.tipoPersonaFE.Natural ? this.pagoPin.compradorFE?.apellido ?? '' : '',
        nombresFacturacion: this.pagoPin.compradorFE?.tipoPersona === this.tipoPersonaFE.Natural? this.pagoPin.compradorFE?.nombre ?? '' : '',
        correoFacturacion: this.pagoPin.compradorFE?.correo ?? '',
        nombreComercialFacturacion: this.pagoPin.compradorFE?.tipoPersona === this.tipoPersonaFE.Juridica ? this.pagoPin.compradorFE?.nombreComercial ?? '' : '',
        numeroIdentificacionFacturacion: this.obtenerTipoIdentificacion(this.pagoPin),
        razonSocialFacturacion: this.pagoPin.compradorFE?.tipoPersona === this.tipoPersonaFE.Juridica ? this.pagoPin.compradorFE?.razonSocial ?? '' : '',
        tipoIdentificacionFacturacion: this.pagoPin.compradorFE?.tipoPersona === this.tipoPersonaFE.Natural
          ? Number(this.pagoPin.compradorFE.tipoDocumento) ?? 0
          : this.obtenerNit(),
        tipoPersonaFacturacion: this.pagoPin.compradorFE?.tipoPersona ?? 0,
      });
    }

    let numeroCuotas: number = this.pagoPin.cuotas ?? 0;
    let cuotaSeleccionadaAuxiliar: CostoCuota = {
          primeraCuota: 0,
          valorCuota: 0,
          valorTotal: 0,
          numeroCuotas: 0
        };


    this.cuotaSeleccionada = this.pagoPin.costoCuotas.find((x: any) => x.numeroCuotas == numeroCuotas) ?? cuotaSeleccionadaAuxiliar;  
    let coutasCompradas: Cuotas[] = [];

    for (let i = 0; i < +numeroCuotas - 1; i++) {
      coutasCompradas.push({
        dispersionAliado: this.pagoPin.valorDiscriminadoCotizacion.banco,
        valorTransaccion: Math.round(Number(this.cuotaSeleccionada?.valorCuota)),
      });
    }

    if (this.pagoPin.clienteCompra == this.tipoCliente.CEA) {
      informacionPago.valorPrimeraCuota = this.cuotaSeleccionada?.primeraCuota
      informacionPago.cuotas = coutasCompradas
      informacionPago.idRunt = this.pagoPin.centroSeleccionado.codigoRUNT
      informacionPago.valorTransaccion = this.cuotaSeleccionada?.valorTotal! > 0 ? Number(this.cuotaSeleccionada?.valorTotal) : Number(this.pagoPin.valorDiscriminadoCotizacion.valorTotal);
    }
    let referenciaPagoBancolombia: ReferenciaPagoBancolombia = {
      referencia: informacionPago,
      idCliente: this.pagoPin.clienteCompra,
      categoria1: this.pagoPin.categoria1,
      categoria2: '' + this.pagoPin.categoria2,
      esCorresponsal: isPSE ? TipoPago.PSE : origenPines,
      idTramite: +(this.pagoPin.tipoTramite),
      host: this.pagoPin.host,
      idDescripcionUserOTP:0
    };
    if (this.referenciaGeneradaPinesOlimpia === null) {
      this._recaptchaV3Service.execute('obtenerReferenciaPinesOlimpia')
      .subscribe((token) => {
        this._data.obtenerReferenciaPinesOlimpia(referenciaPagoBancolombia,token).subscribe(
          (x: ReferenciaGenerada) => {
            if (x.idCotizador != 0 && x.referencia != null && x.referencia != "") {
              this.referenciaGeneradaPinesOlimpia = x;
              this.procesarReferenciaPago(isPSE, this.referenciaGeneradaPinesOlimpia);
            }
            else {
              this._utils.abrirAlerta("No se generó referencia")
            }
          }
        );
      },
      (error) => {

      });

    }
    else {
      this.procesarReferenciaPago(isPSE, this.referenciaGeneradaPinesOlimpia);
    }
  }
  /*
  * Obtener convenio segun el medio de pagos seleccionado
  */
  obtenerConvenioMedioPago(): number {
    if (this.pagoPin.clienteCompra == this.tipoCliente.CEA) {
      if (this.pagoPin.tipoBancoPSE != null) {
        /*PSE por defecto origen Olimpia = 9*/
        return this.origenPin.PinesOlimpia;
      } else if (this.pagoPin.tipoPagoEfectivo != null) {
        /*Punto Pago CEA = 8*/
        return this.origenPin.PuntoPagoCrc;
      } else if(this.tipoReferenciaActual == TipoReferencia.BancolombiaWompi){
        /*Bancolombia Wompi = 13*/
        return this.origenPin.BancolombiaWompi;
      }
      else if (this.tipoReferenciaActual == TipoReferencia.DaviplataWompi) {
        /*daviplata= 16*/
        return this.origenPin.Daviplata;
      }
    }

    if (this.pagoPin.tipoPagoEfectivo != null) {
      /*Medio pago efectivo, para corresponsal bancario bancolombia de deja el origen Olimpia = 9*/
      return (this.pagoPin.tipoPagoEfectivo == this.origenPin.CorresponsalBancolombia ? this.origenPin.PinesOlimpia : this.pagoPin.tipoPagoEfectivo);
    } else if(this.tipoReferenciaActual == TipoReferencia.BancolombiaWompi){
      /*Bancolombia Wompi = 13*/
      return this.origenPin.BancolombiaWompi;
    }
    else if (this.tipoReferenciaActual == TipoReferencia.DaviplataWompi) {

      return this.origenPin.Daviplata;
    }
    else {
      /*PSE por defecto origen Olimpia = 9*/
      return this.origenPin.PinesOlimpia;
    }
  }
  /**
   * Redirige la referencia de pago para la pasarela de pago segun corresponda.
   * @param isPSE
   * @param referenciaGeneradaPines
   */
  procesarReferenciaPago(isPSE: boolean, referenciaGeneradaPines: ReferenciaGenerada) {
    if (isPSE) {
      if (this.pagoPin.pasarelaTuPago) {
        this.redirigirAPagoPSE(
          referenciaGeneradaPines.idCotizador.toString(),
          referenciaGeneradaPines.referencia
        );
      }
      else {
        this.redirigirAPagoPSESecure(
          referenciaGeneradaPines.idCotizador.toString(),
          referenciaGeneradaPines.referencia
        );
      }

    } else {
      this.referenciaGenerada = referenciaGeneradaPines.referencia
      this.llenarParametrosMensaje();
      this.seleccionarPlantillaCompraPin();
      this.enviarAnalytics('Compra de PIN - Generación referencia Efectivo');
      this.parametrosMensaje.NumeroPIN = this.referenciaGenerada
      this._data.obtenerParametrosPinesOlimpia().subscribe((params: ParametrosBancolombia) => {
        this.parametrosMensaje.ConvenioCorresponsal = params.Corresponsal
        if (this.pagoPin.clienteCompra == this.tipoCliente.CRC) {
          this.convenioResumenObj = this.llenarConvenioResumenCrc(params.Corresponsal);
        }
        else {
          this.convenioResumenObj = this.llenarConvenioResumenCea(params.Corresponsal);
        }
        this.principal = false;
      })
    }
  }
  llenarConvenioResumenCrc(convenioCorresponsal: string): ConvenioResumenObj[] {
    return [
      {
        nombre: "referenciaGenerada",
        valor: this.referenciaGenerada
      },
      {
        nombre: "convenioCorresponsal",
        valor: convenioCorresponsal
      },
      {
        nombre: "costoPin",
        valor: Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 }).format(Number(this.pagoPin.valorDiscriminadoCotizacion?.valorTotal)).toString()
      }
    ];
  }

  llenarConvenioResumenCea(convenioCorresponsal: string): ConvenioResumenObj[] {
    return [
      {

        nombre: "referenciaGenerada",
        valor: this.referenciaGenerada
      },
      {
        nombre: "cuotas",
        valor: this.pagoPin.cuotas - 1
      },
      {
        nombre: "valorCuota",
        valor: Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 }).format(Number(this.cuotaSeleccionada?.valorCuota)).toString()
      },
      {
        nombre: "costoPin",
        valor: Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 }).format(Number(this.cuotaSeleccionada?.primeraCuota)).toString()
      },
    ];
  }

  redirigirAPagoPSE(idCotizacion: string, referencia: string) {
    let compra: Orden = {
      itemName: "Mi Licencia-" + referencia,
      itemReference: idCotizacion,
      orderTax: 0,
      orderAmount: this.pagoPin.valorDiscriminadoCotizacion.valorTotal,
      buyerAddress: "",
      buyerPhone: this.pagoPin.usuario.celular.toString(),
      buyerIdType: this.obtenerCodigoACHdelTipoDocumento(this.pagoPin.usuario.tipoDocumento),
      buyerIdNumber: parseInt(this.pagoPin.usuario.numDocumento),
      buyerEmail: this.pagoPin.usuario.correo,
      buyerFullName: `${this.pagoPin.usuario.nombre.substring(0, 24)} ${this.pagoPin.usuario.apellido.substring(0, 25)}`,
      buyerType: this.pagoPin.tipoPersonaPSE,
      paymentReference: idCotizacion.padStart(10, "9")
    }

    if (this.pagoPin.clienteCompra == this.tipoCliente.CEA) {
      compra.orderAmount = Number(this.cuotaSeleccionada?.primeraCuota)
      compra.itemName = "Mi Licencia CEA-" + referencia,
        compra.itemReference = idCotizacion + "-CEA"
    }

    let orden: CrearOrden = {
      orden: compra,
      codigoBanco: this.pagoPin.tipoBancoPSE,
      host: this.pagoPin.host
    }

    this._tuPagoService.obtenerReferenciaPSE(orden).subscribe(
      transaccionResPonsePSE => {
        if (transaccionResPonsePSE.messageError == null) {
          this.enviarAnalytics('Compra de PIN - Generación referencia PSE');
          this.document.location.href = transaccionResPonsePSE.dataPSE.urlPSE
        } else if (transaccionResPonsePSE.messageError.includes("exists") && this.reintentos < 3) {
          this.reintentos = this.reintentos + 1;
          this.obtenerReferencia(referencia, true, () => { this.pagarConPinesOlimpia(true); });
        }
        else {
          this.reintentos = 0;
          this._utils.abrirAlerta("No fue posible realizar su compra")
        }
      }
    );
  }

  redirigirAPagoPSESecure(idCotizacion: string, referencia: string) {
    let pagador: Payer = {
      address: "",
      cellPhoneNumber: "" + this.pagoPin.usuario.celular,
      documentType: this.obtenerCodigoACHdelTipoDocumento(this.pagoPin.usuario.tipoDocumento),
      documentNumber: this.pagoPin.usuario.numDocumento + "",
      email: this.pagoPin.usuario.correo,
      fullName: `${this.pagoPin.usuario.nombre.substring(0, 24)} ${this.pagoPin.usuario.apellido.substring(0, 25)}`,
      typeUser: this.pagoPin.tipoPersonaPSE
    }
    let compra: Compra = {
      bank: +this.pagoPin.tipoBancoPSE,
      description: "MiLicencia CRC " + referencia,
      referencePayment: idCotizacion,
      tax: 0,
      value: this.pagoPin.valorDiscriminadoCotizacion.valorTotal,
      payer: pagador
    }
    if (this.pagoPin.clienteCompra == this.tipoCliente.CEA) {
      compra.value = Number(this.cuotaSeleccionada?.primeraCuota)
      compra.description = "MiLicencia CEA " + referencia
    }

    let compraTipoCliente: CompraTipoCliente = {
      compra: compra,
      tipoCliente: this.pagoPin.clienteCompra
    }

    this._securePayService.obtenerReferenciaPSE(compraTipoCliente).subscribe(
      respuestaPasarela => {
        if (respuestaPasarela.code == "OK") {
          this.enviarAnalytics('Compra de PIN - Generación referencia PSE');
          this.document.location.href = respuestaPasarela.transactionResponse?.url
        } else {
          this.obtenerReferencia(referencia, true, () => { });//no se redirige pero genera nueva referencia
          this._utils.abrirAlerta("No fue posible realizar su compra")
        }
      }
    );
  }

  obtenerPlantilla(fn: any) {
    this._data.obtenerPlantillas().subscribe((x: any) => {
      this.pagoPin.plantillas = x;
      fn();
    });
  }

  llenarParametrosMensaje() {
    if (this.pagoPin.tipoPagoEfectivo != null) {
      this.parametrosMensaje = {
        Nombre: this.pagoPin.usuario.nombre + " " + this.pagoPin.usuario.apellido,
        NumeroPIN: "",
        Edad: this.pagoPin.edadAspirante.toString(),
        Sexo: this.pagoPin.usuario.genero == 1 ? "Hombre" : "Mujer",
        Categoria: this.pagoPin.categoria1 + (this.pagoPin.categoria2 != '' ? ', ' + this.pagoPin.categoria2 : ''),
        ValorCrc: this.pagoPin.valorDiscriminadoCotizacion.crc.toString(),
        ValorSicov: this.pagoPin.valorDiscriminadoCotizacion.sicov.toString(),
        ValorBanco: this.pagoPin.valorDiscriminadoCotizacion.banco.toString(),
        ValorANSV: this.pagoPin.valorDiscriminadoCotizacion.ansv.toString(),
        TotalaPagar: (this.pagoPin.clienteCompra == this.tipoCliente.CEA ?  this.cuotaSeleccionada?.primeraCuota != undefined && this.cuotaSeleccionada?.primeraCuota > 0 ? this.cuotaSeleccionada?.primeraCuota.toString() : this.pagoPin.valorDiscriminadoCotizacion.valorTotal.toString() : this.pagoPin.valorDiscriminadoCotizacion.valorTotal.toString()),
        Centro: this.pagoPin.centroSeleccionado.nombre,
        Direccion: this.pagoPin.centroSeleccionado.direccion,
        Telefono: this.pagoPin.centroSeleccionado.fijo,
        Destinatario: this.pagoPin.usuario.correo,
        ConvenioCorresponsal: "",
        Plantilla: 0,
        Leyenda: (this.pagoPin.clienteCompra == this.tipoCliente.CEA ? "1 de " + this.cuotaSeleccionada?.numeroCuotas : ""),
        Corresponsal:this.corresponsalDato
      };
    }

  }

  seleccionarPlantillaCompraPin() {
    if (this.pagoPin.tipoPagoEfectivo != this.origenPin.CorresponsalBancolombia) {
      this.parametrosMensaje.Plantilla = this.pagoPin.clienteCompra == this.tipoCliente.CRC ? this.pagoPin.plantillas["CrcRefPDP"] : this.pagoPin.plantillas["CeaRefPDP"];
    }
    else {
      this.parametrosMensaje.Plantilla = this.pagoPin.clienteCompra == this.tipoCliente.CRC ? this.pagoPin.plantillas["CrcRefBancolombia"] : this.pagoPin.plantillas["CeaRefBancolombia"];
    }
  }

  imprimir() {
    window.print()
  }

  pagoBalotoIndependiente() {
    if (this.pagoPin.conveniosPagoEfectivo && this.pagoPin.conveniosPagoEfectivo.length > 0) {
      this.corresponsalDato = this.pagoPin.conveniosPagoEfectivo.find((x: Convenio) => x.idOrigenPin==this.pagoPin.tipoPagoEfectivo) ?this.pagoPin.conveniosPagoEfectivo.find((x: Convenio) => x.idOrigenPin==this.pagoPin.tipoPagoEfectivo).convenioNombre: "Corresponsal Bancario";
    }
    this.llenarParametrosMensaje()
    let baloto = this.pagoPin.tipoPagoEfectivo == this.origenPin.BalotoIndependientes ? true : false;
    if (baloto) {
      this.enviarAnalytics('Compra de PIN - Generación referencia Efectivo');
      this.parametrosMensaje.Plantilla = this.pagoPin.clienteCompra == this.tipoCliente.CRC ? this.pagoPin.plantillas["CrcRefBaloto"] : "";
    }
    this.convenioResumenObj = [{ nombre: "costoPin", valor: Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 }).format(Number(this.pagoPin.valorDiscriminadoCotizacion?.valorTotal)) }];
    this.principal = false;
  }

  volverAlInicio() {
    this._utils.cambiarRutaInterna("/");
  }

  cambiarAVista(vista: number) {
    this.cambiarVistaEvent.emit(vista);
  }

  enviarAnalytics(action: string) {
    if (!this.pagoPin.analytics.fin) {
      this.pagoPin.analytics.fin = true;
      this._googleAnalyticsService.eventEmitter('event', action, 'click', this.pagoPin.analytics.label, 0);
    }
  }

  obtenerReferencia(pin: string, nuevaRef: boolean = false, fn: any) {
    let referencia: SeleccionarReferenciaTransaccionCuotaRequest = {
      pin: pin,
      nuevaReferencia: nuevaRef,
      cliente: this.pagoPin.clienteCompra
    };
    this._data.seleccionarReferenciaTransaccionCuota(referencia).subscribe(
      (x: ReferenciaGenerada) => {
        if (x.idCotizador != 0 || x.referencia != null) {
          this.referenciaGeneradaPinesOlimpia.idCotizador = Number(x.referencia);
          fn();
        }
        else {
          this._utils.abrirAlerta("No se generó referencia")
        }
      }
    );
  }

}
