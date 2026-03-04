import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MedioPago, MediosPago, TipoPago } from 'src/app/enums/PinesOlimpia/TipoPago';
import { TipoPersona } from 'src/app/enums/PinesOlimpia/TipoPersona';
import { Convenio } from 'src/app/interfaces/cotizacion/Convenio';
import { CuotaCea } from 'src/app/interfaces/pago/PinesOlimpia/Consulta/CuotaCea';
import { Banco } from 'src/app/interfaces/pago/SecurePay/Banco';
import { Compra } from 'src/app/interfaces/pago/SecurePay/Compra';
import { Payer } from 'src/app/interfaces/pago/SecurePay/Payer';
import { DataService } from 'src/app/services/data/cotizador/data.service';
import { SecurePayService } from 'src/app/services/data/secure-pay/secure-pay.service';
import { UtilService } from 'src/app/services/util/util.service';
import { DOCUMENT } from '@angular/common';
import { SeleccionarReferenciaTransaccionCuotaRequest } from 'src/app/interfaces/pago/PinesOlimpia/SeleccionarReferenciaTransaccionCuotaRequest';
import { ReferenciaGenerada } from 'src/app/interfaces/pago/PinesOlimpia/ReferenciaGenerada';
import { ConsultaTransaccionRequest } from 'src/app/interfaces/pago/SecurePay/ConsultaTransaccionRequest';
import { ReporteDetallado2 } from 'src/app/interfaces/pago/SecurePay/ConsultaTransaccionResponse';
import { PilotoCea } from 'src/app/interfaces/pago/SecurePay/PilotoCea';
import { CorreoCuota } from 'src/app/interfaces/pago/PinesOlimpia/Consulta/CorreoCuota';
import { consultaCentroParametros } from 'src/app/interfaces/compraPin/consultaCentroParametro';
import { CompraPinService } from 'src/app/services/data/compra-pin/compra-pin.service';
import { TuPagoService } from 'src/app/services/data/tu-pago/tu-pago.service';
import { Bancos } from 'src/app/interfaces/pago/TuPago/Banco';
import { CentroParametros } from 'src/app/interfaces/compraPin/CentroParametros';
import { CrearOrden, Orden } from 'src/app/interfaces/pago/TuPago/Orden';
import { TipoCliente } from 'src/app/enums/PinesOlimpia/TipoCliente';
import moment from 'moment';
import { TipoDocumentoPtesaDTO } from 'src/app/interfaces/cotizacion/TipoDocumentoPtesaDTO';
import { TipoDocumentoPtesaClass } from 'src/app/class/cotizador/tipoDocumentoPtesaClass';
import { CompraTipoCliente } from 'src/app/interfaces/pago/SecurePay/CompraTipoCliente';
import { ConsultaTransaccionTipoCliente } from 'src/app/interfaces/pago/SecurePay/ConsultaTransaccionTipoCliente';

@Component({
  selector: 'app-metodos-recaudo',
  templateUrl: './metodos-recaudo.component.html',
  styleUrls: ['./metodos-recaudo.component.scss']
})
export class MetodosRecaudoComponent implements OnInit {
  tipoRecaudo: any = TipoPago
  mediosPago: MedioPago[] = MediosPago
  tipoPersona: any = TipoPersona;

  conveniosPagoEfectivo: Convenio[] = [];
  bancosPSE: Bancos[] = [];
  bancosPSESecure: Banco[] = [];
  pasarelaTuPago: boolean = false;
  tiposDeDocumento: TipoDocumentoPtesaDTO[] = [];
  formulario!: FormGroup;
  pilotoCEA!: PilotoCea
  correoCuota: CorreoCuota;
  validacionEnvioCorreo: boolean = true;
  host: string = "";
  ipAddress!: string;

  cuota: CuotaCea;
  idCentro: string;
  reintentos: number = 0;
  tipoCliente: any = TipoCliente;
  continuarProceso: boolean = true;
  _tipoDocumentoPtesaClass!: TipoDocumentoPtesaClass;

  constructor(
    private readonly _securePayService: SecurePayService,
    private readonly _compraPin: CompraPinService,
    private readonly _tuPagoService: TuPagoService,
    private readonly _utils: UtilService,
    private readonly _data: DataService,
    private readonly _formBuilder: FormBuilder,
    @Inject(DOCUMENT) private readonly document: Document,
    public dialogRef: MatDialogRef<MetodosRecaudoComponent>,
    @Inject(MAT_DIALOG_DATA) public data: CorreoCuota) {
    this.cuota = this.data.cuotaCea;
    this.correoCuota = this.data;
    this.idCentro = this.data.idCentro;
    this.ObtenerParametro();
    this._tipoDocumentoPtesaClass = new TipoDocumentoPtesaClass(this._data);
    this.obtenerTiposIdentificacion();
  }

  ngOnInit(): void {
    this.obtenerDatosCEAprovisional();
    this.formulario = this._formBuilder.group({
      tipoRecaudoCtrl: [null, Validators.required],
      tipoPersonaPSE: ['', Validators.required],
      tipoBancoPSE: ['', Validators.required],
    });

    this.mediosPago = this.mediosPago.filter(medio => medio.id == this.tipoRecaudo.Efectivo);
  }

  private obtenerDatosCEAprovisional() {
    this._data.obtenerParametrosPilotoCEA().subscribe(
      (x: PilotoCea) => {
        this.pilotoCEA = x;
        if (!this.pilotoCEA.admitePSECea) {
          this.mediosPago = this.mediosPago.filter(medio => medio.id == this.tipoRecaudo.Efectivo)
        }
      }
    );
  }

  private ObtenerParametro() {
    let consultaParametrosCentro: consultaCentroParametros = {
      idCentro: Number(this.idCentro),
      codigo: "PASTUPAGOACTI",
      descripcion: "Activar Pasarela TuPago-MiLicencia",
      plataforma: "CEA"
    }
    this._compraPin.ObtenerCentroParametrosIdCentro(consultaParametrosCentro).subscribe((resp: CentroParametros[]) => {
      if (resp[0].valor !== null) {
        if (resp[0].valor === "1") {
          this.pasarelaTuPago = true;
          this.obtenerBancos();
        }
        else {
          this.pasarelaTuPago = false;
          this.obtenerBancosSecure();
        }
      }
    })
  }
  /*
  * Obtener bancos habilitados para pago por PSE
  */
  private obtenerBancos(): void {
    this._tuPagoService.obtenerBancos().subscribe(
      listaBancos => this.bancosPSE = listaBancos
    )
  }
  private obtenerBancosSecure(): void {
    this._securePayService.obtenerBancos(this.tipoCliente.CEA).subscribe(
      listaBancos => this.bancosPSESecure = listaBancos
    )
  }

  obtenerCodigoACHdelTipoDocumento(typeDocumentId: any) {
    const typeSelected = this.tiposDeDocumento.find(
      (x) => x.idTipoSisec == typeDocumentId
    );
    return typeSelected?.codigoACH;
  }


  private obtenerTiposIdentificacion(): void {
    this._tipoDocumentoPtesaClass.get().subscribe((s: TipoDocumentoPtesaDTO[]) => {
      this._tipoDocumentoPtesaClass.set(s);
      this.tiposDeDocumento = this._tipoDocumentoPtesaClass.getDocumentosByClienteCompra(TipoCliente.CRC);
    });
  }


  obtenerReferencia(nuevaRef: boolean = false) {
    let referencia: SeleccionarReferenciaTransaccionCuotaRequest = {
      pin: this.cuota.numeroPin,
      nuevaReferencia: nuevaRef,
      cliente: this.tipoCliente.CEA
    };
    this._data.seleccionarReferenciaTransaccionCuota(referencia).subscribe(
      (x: ReferenciaGenerada) => {
        if (this.continuarProceso) {
          if (this.pasarelaTuPago) {
            this.redirigirAPagoPSE(
              x.idCotizador.toString(),
              x.referencia
            );
          }
          else {
            this.redirigirAPagoPSESecure(
              x.referencia
            );
          }
        }
        this.continuarProceso = true;
      }
    );
  }

  /**
   *
   * @param idCotización
   * @param referencia
   */
  redirigirAPagoPSE(idCotización: string, referencia: string) {
    let compra: Orden = {
      itemName: "Mi Licencia CEA-" + this.cuota.numeroPin,
      itemReference: referencia + "-CEA",
      orderTax: 0,
      orderAmount: this.cuota.valorPin,
      buyerAddress: "",
      buyerPhone: this.cuota.numeroTelefono,
      buyerIdType: this.obtenerCodigoACHdelTipoDocumento(this.cuota.idTipoIdentificacion),
      buyerIdNumber: parseInt(this.cuota.numeroIdentificacion),
      buyerEmail: this.cuota.email,
      buyerFullName: `${this.cuota.nombres} ${this.cuota.apellidos}`,
      buyerType: this.formulario.value.tipoPersonaPSE,
      paymentReference: referencia.padStart(10, "9")
    }

    let orden: CrearOrden = {
      orden: compra,
      codigoBanco: this.formulario.value.tipoBancoPSE,
      host: this.host
    }
    this._tuPagoService.obtenerReferenciaPSE(orden).subscribe(
      transaccionResPonsePSE => {
        if (transaccionResPonsePSE.messageError == null) {
          this.document.location.href = transaccionResPonsePSE.dataPSE.urlPSE
        } else if (transaccionResPonsePSE.messageError.includes("exists") && this.reintentos < 3) {
          this.reintentos = this.reintentos + 1;
          this.obtenerReferencia(true);
        }
        else {
          this.reintentos = 0;
          this._utils.abrirAlerta("No fue posible realizar su compra")
        }
      }
    );
  }


  redirigirAPagoPSESecure(referenciaPago: string) {

    let pagador: Payer = {
      address: "",
      cellPhoneNumber: this.cuota.numeroTelefono,
      documentType: this.obtenerCodigoACHdelTipoDocumento(this.cuota.idTipoIdentificacion),
      documentNumber: this.cuota.numeroIdentificacion,
      email: this.cuota.email,
      fullName: `${this.cuota.nombres} ${this.cuota.apellidos}`,
      typeUser: this.formulario.value.tipoPersonaPSE
    }
    let compra: Compra = {
      bank: +(this.formulario.value.tipoBancoPSE),
      description: "MiLicencia CEA " + this.cuota.numeroPin,
      referencePayment: referenciaPago,
      tax: 0,
      value: this.cuota.valorPin,
      payer: pagador
    }

    let compraTipoCliente: CompraTipoCliente = {
      compra: compra,
      tipoCliente: this.tipoCliente
    }

    this._securePayService.obtenerReferenciaPSE(compraTipoCliente).subscribe(
      respuestaPasarela => {
        if (respuestaPasarela.code == "OK") {
          this.document.location.href = respuestaPasarela.transactionResponse?.url;
        } else if (respuestaPasarela.code == "Accepted" && this.reintentos < 3) {
          //this._utils.abrirAlerta(respuestaPasarela.message)
          this.reintentos = this.reintentos + 1;
          //this.reintentarPagarCuota(referenciaPago);
          this.obtenerReferencia(true);
        } else {
          this.continuarProceso = false;
          this.reintentos = 0;
          this.obtenerReferencia(true);
          this._utils.abrirAlerta("No fue posible realizar su compra")
        }
      }
    );
  }

  reintentarPagarCuota(referenciaPago: string) {
    let fecha: moment.Moment = moment();
    let consulta: ConsultaTransaccionRequest = {
      fechaTransaccionDesde: fecha!.format("DD/MM/YYYY"),
      fechaTransaccionHasta: fecha!.format("DD/MM/YYYY"),
      referenciaPago: referenciaPago,
      cus: ""
    }

    let consultaTransaccionTipoCliente: ConsultaTransaccionTipoCliente={
      consultaTransaccion: consulta,
      tipoCliente: TipoCliente.CRC
    }

    this._securePayService.obtenerInformacionTransaccion(consultaTransaccionTipoCliente).subscribe(
      x => {
        let respuesta: ReporteDetallado2 | undefined = x.reporteDetallado.reporteDetallado.find(y => y.estado == "Rechazada");
        if (respuesta != null) {
          //this.obtenerReferencia(true);
        }
      }
    )
  }
  enviarOrdenPago() {
    this._data.enviarCorreoCuota(this.correoCuota).subscribe(x => {
      this.validacionEnvioCorreo = false;
    });
  }
}
