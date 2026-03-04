import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { OpcionTramite } from 'src/app/enums/OpcionTramite';
import { OrigenPin } from 'src/app/enums/OrigenPin';
import { TipoCliente } from 'src/app/enums/PinesOlimpia/TipoCliente';
import { MedioPago, TipoPago } from 'src/app/enums/PinesOlimpia/TipoPago';
import { DescripcionTramite, Tramite } from 'src/app/enums/Tramite';
import { Icons } from 'src/app/enums/Utils/Icons';
import { ConsultaCentoId } from 'src/app/interfaces/centro/ConsultaCentoId';
import { CentroParametros } from 'src/app/interfaces/compraPin/CentroParametros';
import { consultaCentroParametros } from 'src/app/interfaces/compraPin/consultaCentroParametro';
import { ConsultaCostoPinCea } from 'src/app/interfaces/compraPin/ConsultaCostoPinCea';
import { PagoPin } from 'src/app/interfaces/compraPin/PagoPin';
import { Centro } from 'src/app/interfaces/cotizacion/Centro';
import { ConsultaConvenioCentro } from 'src/app/interfaces/cotizacion/ConsultaConveniosCentro';
import { Convenio } from 'src/app/interfaces/cotizacion/Convenio';
import { DiscriminadoValorPin } from 'src/app/interfaces/cotizacion/DiscriminadoValorPin';
import { ParametrosCostoPin } from 'src/app/interfaces/cotizacion/ParametrosCostoPin';
import { CompraPinService } from 'src/app/services/data/compra-pin/compra-pin.service';
import { DataService } from 'src/app/services/data/cotizador/data.service';
import { SecurePayService } from 'src/app/services/data/secure-pay/secure-pay.service';
import { TuPagoService } from 'src/app/services/data/tu-pago/tu-pago.service';
import { UtilService } from 'src/app/services/util/util.service';


@Component({
  selector: 'app-seleccion-centro',
  templateUrl: './seleccion-centro.component.html',
  styleUrls: ['./seleccion-centro.component.scss']
})
export class SeleccionCentroComponent implements OnInit {
  /**
  * Controles y formularios
  */
  tipoCliente: any = TipoCliente;
  readonly: boolean = false;
  mayoriaDeEdad: number = 18;
  tramites: any = Tramite;
  descripcionTramite: any = DescripcionTramite;
  tipoRecaudo: any = TipoPago;
  habilitadoPSE: boolean = false;
  origenPin: any = OrigenPin;
  pasarelaTuPago: boolean = false;
  opcionTramites: any = OpcionTramite;
  view: boolean = false;
  habilitadoNequiWompi:boolean=false;
  habilitadoBancolombiaWompi:boolean=false;
  habilitadoTDCWompi:boolean=false;
  habilitadoDaviplata:boolean=false;

  @Input() pagoPin!: PagoPin;
  @Output() pagoPinEvent = new EventEmitter<PagoPin>();
  @Output() pagoPinVolverEvent = new EventEmitter<boolean>();
  @Output() pagoErrorValoresCentroEvent = new EventEmitter<boolean>();
  constructor(
    private readonly _data: DataService,
    private readonly _compraPin: CompraPinService,
    private readonly _utils: UtilService,
    private readonly _securePayService: SecurePayService,
    private readonly _tuPagoService: TuPagoService,
  ) { }

  ngOnInit(): void {
    if (this.pagoPin.obtenerPagoCrc) {
      this.calcularPinParaCRC(() => { });
    }

    else if (this.pagoPin.centroIpValidacion && this.pagoPin.centroSeleccionado != null && !this.pagoPin.centroIpVolver) {
      this.obtenerIdCentroSeleccionadoLista(this.pagoPin.centroSeleccionado);
      setTimeout(() => {
        this.avanzar();
      })
    }
    else {
      this.view = true;
      this.obtenerValorPin(() => { });
    }
  }

  recuperarIdCategoriaDesdeCodigo(codigoCategoria: string): number {
    if (this.pagoPin.clienteCompra == this.tipoCliente.CEA
      && this.pagoPin.tipoTramite == this.tramites.Recategorizar
      && this.pagoPin.categoriasActual == "B1"
      && this.pagoPin.categoria1 == "C1") {
      this.pagoPin.categoria1 = "RC1";
      codigoCategoria = this.pagoPin.categoria1;
    }
    let response: number | null | undefined = this.pagoPin.categoriasCea?.find(x => x.codigo == codigoCategoria)?.idCategoria ?? 0;
    return response ?? 0;
  }

  /**
   * Se obtiene el marcador desde el mapa
   * @param centroSeleccionado Centro obtenido desde el mapa
   */
  obtenerIdCentroSeleccionadoMapa(centroSeleccionado: Centro): void {
    if (centroSeleccionado) {
      this.pagoPin.centroSeleccionado = centroSeleccionado;
      let consultaConvenioCentro: ConsultaConvenioCentro = {
        CodigoDestino: centroSeleccionado.codigoRUNT?.toString(),
        IdCentro: centroSeleccionado.idCentro
      }
      this.obtenerValorPin(() => { this.obtenerConvenios(consultaConvenioCentro, true) });
    }
  }

  obtenerValorPin(fn: any) {
    if (this.pagoPin.categoria1 === null || this.pagoPin.categoria1 === '') {
      this.pagoPin.categoria1 = this.pagoPin.categoria2;
      this.pagoPin.categoria2 = '';
    }
    this.pagoPin.categoria = this.pagoPin.categoria1
    if (this.pagoPin.centroSeleccionado) {
      if (this.pagoPin.clienteCompra == this.tipoCliente.CEA) {
        this.calcularPinParaCEA(fn);
      } else {
        this.calcularPinParaCRC(fn);
      }
    }
  }

  private calcularPinParaCRC(fn: any) {
    let parametrosCosto: ParametrosCostoPin = {
      codigoCategoria1: this.pagoPin.categoria1,
      codigoCategoria2: this.pagoPin.categoria2,
      edad: this.pagoPin.edadAspirante,
      genero: this.pagoPin.usuario.genero,
      idCentro: this.pagoPin.centroSeleccionado?.idCentro,
      idOrigenPin: (this.pagoPin.obtenerPagoCrc ? this.TipoOrigenPin(this.pagoPin): this.tipoRecaudo.PSE)
    };
    this._data.obtenerPrecioPIN(parametrosCosto).subscribe(
      (x: DiscriminadoValorPin) => {
        if (!this.ValidarValoresPin(x)) {
          this.pagoPin.centroSeleccionado = null;
          this.pagoErrorValoresCentroEvent.emit(true);
        }
        else {
          if (this.pagoPin.obtenerPagoCrc) {
            this.pagoPin.valorDiscriminadoCotizacion = x;
            this.cambioCuotasValores();
            this.avanzar();/*se devuelve al componente principal, metodo solo para obtener el valor del pin*/
          }
          else {
            this.pagoPin.valorDiscriminadoCotizacionAprox = x;
          }
          fn();
        }
      }
    );
  }

  private calcularPinParaCEA(fn: any) {
    if (this.pagoPin.clienteCompra == this.tipoCliente.CEA &&
      this.pagoPin.tipoTramite == this.tramites.Recategorizar
      && this.pagoPin.categoriasActual == "B1"
      && this.pagoPin.categoria1 == "C1") {
      this.pagoPin.categoria1 = "RC1";
    }
    let parametrosCostoCEA: ConsultaCostoPinCea = {
      edad: this.pagoPin.edadAspirante,
      genero: this.pagoPin.usuario.genero,
      idCategoria: this.recuperarIdCategoriaDesdeCodigo(this.pagoPin.categoria1),
      idCentro: this.pagoPin.centroSeleccionado?.idCentro,
      idTramite: this.pagoPin.tipoTramite
    };
    this._compraPin.obtenerPrecioPINCEA(parametrosCostoCEA).subscribe(
      (x: DiscriminadoValorPin) => {
        if (!this.ValidarValoresPin(x)) {
          this.pagoPin.centroSeleccionado = null;
          this.pagoErrorValoresCentroEvent.emit(true)
        }
        else {
          this.pagoPin.valorDiscriminadoCotizacion = x;
          if (!this.pagoPin.valorDiscriminadoCotizacion) {
            this.pagoPin.centroSeleccionado = null;
            this._utils.abrirDialogo(
              "No hay tarifa configurada para categoria " + this.pagoPin.categoria1 +
              " en el centro " + this.pagoPin.centroSeleccionado!.nombre +
              ". Por favor, selecciona otra categoria y/o centro",
              Icons.warning);
            this.volver();
          }
          else {
            this.cambioCuotasValores();
          }
          fn();
        }
      }
    );
  }
  /**
   * Funcion que redondea en 100
   * @param num
   * @returns
   */
  RoundNum(num: number) {
    return Math.ceil(num / 100.0) * 100;
  }

  private cambioCuotasValores() {
    this.pagoPin.costoCuotas = [];
    this.pagoPin.cuotas = 0;
    if (this.pagoPin.valorDiscriminadoCotizacion) {
      this.pagoPin.costoCuotas = this.pagoPin.valorDiscriminadoCotizacion.calculoCoutas;
    }
  }
  /**
   *
   * @param consultaConvenioCentro
   * @param next
   */
  private obtenerConvenios(consultaConvenioCentro: ConsultaConvenioCentro, next: boolean) {
    this.pagoPin.tipoRecaudoCtrl = 0;
    if (this.pagoPin.clienteCompra == this.tipoCliente.CEA) {
      let consultaCentoId: ConsultaCentoId = {
        idCentro: consultaConvenioCentro.IdCentro
      }

      this._data.obtenerConveniosCentroCEA(consultaCentoId).subscribe((resp: Convenio[]) => {
        this.validarConvenio(consultaConvenioCentro, resp, next);
      });
    }
    else {
      this._data.obtenerConveniosCentro(consultaConvenioCentro).subscribe((resp: Convenio[]) => {
        this.validarConvenio(consultaConvenioCentro, resp, next);
      });
    }
  }
  /**
   * Valida la respuesta de la consulta de los convenios.
   * @param consultaConvenioCentro
   * @param convenio
   * @param next
   */
  private validarConvenio(consultaConvenioCentro: ConsultaConvenioCentro, convenio: Convenio[], next: boolean) {
    this.pagoPin.tieneConvenios = convenio.length != 0;
    if (!this.pagoPin.tieneConvenios) {
      this._utils.abrirDialogo("No hay convenios en este centro", Icons.info);
    }
    else {
      this.pagoPin.conveniosPagoEfectivo = convenio.filter(x => x.idOrigenPin != this.origenPin.PinesOlimpia && x.idOrigenPin != this.origenPin.NequiWompi && x.idOrigenPin != this.origenPin.BancolombiaWompi && x.idOrigenPin != this.origenPin.TDCWompi && x.idOrigenPin != this.origenPin.Colpatria && x.idOrigenPin != this.origenPin.Daviplata && x.idOrigenPin != this.origenPin.Bnpl);
      this.habilitadoPSE = convenio.some(x => x.idOrigenPin == this.origenPin.PinesOlimpia);
      this.habilitadoNequiWompi=convenio.some(x=>x.idOrigenPin==this.origenPin.NequiWompi);
      this.habilitadoBancolombiaWompi=convenio.some(x=>x.idOrigenPin==this.origenPin.BancolombiaWompi);;
      this.habilitadoTDCWompi=convenio.some(x=>x.idOrigenPin==this.origenPin.TDCWompi);
      this.habilitadoDaviplata=convenio.some(x=>x.idOrigenPin==this.origenPin.Daviplata);
      this.pagoPin.mediosPago=[];
      this.pagoPin.conveniosMediosPago = convenio;

      if (this.habilitadoPSE) {
        let consultaParametrosCentro: consultaCentroParametros = {
          idCentro: consultaConvenioCentro.IdCentro,
          codigo: "PASTUPAGOACTI",
          descripcion: "Activar Pasarela TuPago-MiLicencia",
          plataforma: this.pagoPin.clienteCompra == this.tipoCliente.CEA ? "CEA" : "CRC"
        }
        this._compraPin.ObtenerCentroParametrosIdCentro(consultaParametrosCentro).subscribe((resp: CentroParametros[]) => {
          if (resp[0].valor !== null) {
            if (resp[0].valor === "1" && this.pagoPin.clienteCompra != this.tipoCliente.CEA) {
              this.pagoPin.pasarelaTuPago = true;
              this.obtenerBancos();
            }
            else {
              this.pagoPin.pasarelaTuPago = false;
              this.obtenerBancosSecure();
            }
          }
        })
        let medionuevo:MedioPago[] = [{
          id: TipoPago.PSE,
          nombre: "PSE"
        }
        ];
        this.pagoPin.mediosPago = medionuevo;

      }
      // Efectivo habilitado
      if(this.pagoPin.conveniosPagoEfectivo.length > 0){
        let efectivo:MedioPago[] = [{
          id: TipoPago.Efectivo,
          nombre: "Efectivo"
      }];
      this.pagoPin.mediosPago?.push(efectivo[0]);

      }
      // Nequi wompi
      if(this.habilitadoNequiWompi){
        let medionequiwompi:MedioPago[] = [{
          id: TipoPago.NequiWompi,
          nombre: "Nequi"
      }];
      this.pagoPin.mediosPago?.push(medionequiwompi[0]);
      }
      // Bancolombia wompi
      if(this.habilitadoBancolombiaWompi){
        let medioBancolombiaWompi:MedioPago[] = [
          {
              id: TipoPago.BancolombiaWompi,
              nombre: "Bancolombia"
          }];
          this.pagoPin.mediosPago?.push(medioBancolombiaWompi[0]);
      }
      // TDC Wompi
      if(this.habilitadoTDCWompi){
        let TDCWompi:MedioPago[] = [
          {
              id: TipoPago.TdCWompi,
              nombre: "Tarjeta de Credito"
          }];
          this.pagoPin.mediosPago?.push(TDCWompi[0]);
      }
      // TDC Wompi
      if(this.habilitadoDaviplata){
        let BotonDaviplata:MedioPago[] = [
          {
              id: TipoPago.Daviplata,
              nombre: "Daviplata"
          }];
          this.pagoPin.mediosPago?.push(BotonDaviplata[0]);
      }

      this.pagoPin.mediosPagoTodos = this.pagoPin.mediosPago;
      if (next) {
        this.avanzar()
      }
    }
  }

  /**
   * Obtener bancos habilitados para pago por PSE
   */
  private obtenerBancos(): void {
    this._tuPagoService.obtenerBancos().subscribe(
      (listaBancos: any) => this.pagoPin.bancosPSE = listaBancos
    )
  }

  private obtenerBancosSecure(): void {

    this._securePayService.obtenerBancos(this.pagoPin.clienteCompra==this.tipoCliente.CRC ? this.tipoCliente.CRC : this.tipoCliente.CEA).subscribe(
      (listaBancos: any) => this.pagoPin.bancosPSESecure = listaBancos
    )
  }

  /**
   * Se obtiene el centro desde la lista desplegable
   * @param centroSeleccionado Centro obtenido desde el mapa
   */
  obtenerIdCentroSeleccionadoLista(centroSeleccionado: Centro): void {
    if (centroSeleccionado) {
      this.pagoPin.centroSeleccionado = centroSeleccionado;
      let consultaConvenioCentro: ConsultaConvenioCentro = {
        CodigoDestino: centroSeleccionado.codigoRUNT?.toString(),
        IdCentro: centroSeleccionado.idCentro
      }
      this.obtenerValorPin(() => { this.obtenerConvenios(consultaConvenioCentro, false) });
    }
  }

  validarCategoriaPreSeleccionada() {
    if ((this._data.idCategoriaSeleccionadaMapa$ != undefined && this._data.idCategoriaSeleccionadaMapa$ != "")
      && this.pagoPin.clienteCompra == this.tipoCliente.CEA
      && this.pagoPin.tipoTramite == this.tramites.PrimeraVez) {
      this.pagoPin.categoria1 = this._data.idCategoriaSeleccionadaMapa$;
      this.obtenerValorPin(() => { });
    }
  }

  private ValidarValoresPin(x: DiscriminadoValorPin): boolean {
    if (x.valorTotal == 0
      || x.ansv == 0
      || x.banco == 0
      || x.crc == 0) {
      this.view = true;
      this._utils.abrirAlerta("los valores del pin no se generaron correctamente, intente nuevamente.")
      return false;
    }
    return true;
  }

  avanzar() {
    this.pagoPinEvent.emit(this.pagoPin);
  }

  volver() {
    this.pagoPinVolverEvent.emit(true)
  }

  avanzarCentro() {
    this.validarCategoriaPreSeleccionada();
    this.pagoPinEvent.emit(this.pagoPin);
  }

  private TipoOrigenPin(pagoPin:PagoPin):number{
    let resultado=0;
    switch(pagoPin.tipoRecaudoCtrl){
      case TipoPago.PSE:
        resultado= TipoPago.PSE;
      break;
      case TipoPago.BancolombiaWompi:
        resultado= TipoPago.BancolombiaWompi;
      break;
      case TipoPago.NequiWompi:
        resultado=TipoPago.NequiWompi;
      break;
      case TipoPago.TdCWompi:
        resultado=TipoPago.TdCWompi;
      break;
      case TipoPago.Daviplata:
        resultado=TipoPago.Daviplata;
      break;
      default:
        resultado=pagoPin.tipoPagoEfectivo!;
        break;

    }
    return resultado;
  }
}
