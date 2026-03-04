import { DOCUMENT } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PasosCotizacion } from 'src/app/enums/forms/Cotizador';
import { CotizadorUrl } from 'src/app/enums/forms/CotizadorUrl';
import { PasosCompraPin } from 'src/app/enums/forms/PasosCompraPin';
import { OpcionTramite } from 'src/app/enums/OpcionTramite';
import { TipoCliente } from 'src/app/enums/PinesOlimpia/TipoCliente';
import { Tramite } from 'src/app/enums/Tramite';
import { ComponentesCompra } from 'src/app/interfaces/compraPin/ComponentesCompra';
import { PagoPin } from 'src/app/interfaces/compraPin/PagoPin';
import { Centro } from 'src/app/interfaces/cotizacion/Centro';
import { currentDataIp } from 'src/app/interfaces/Otros/currentDataIp';
import { PermiteFacturaElectronicaRequest } from 'src/app/interfaces/pago/FacturacionElectronica/PermiteFacturaElectronicaRequest';
import { CentroActualIp } from 'src/app/interfaces/pago/PinesOlimpia/CentroActualIp';
import { PilotoCea } from 'src/app/interfaces/pago/SecurePay/PilotoCea';
import { DataService } from 'src/app/services/data/cotizador/data.service';
import { GoogleAnalyticsService } from 'src/app/services/data/googleAnalytics/google-analytics.service';
import { MlapiService } from 'src/app/services/data/mlapi/mlapi.service';
import { UtilGeneralService } from 'src/app/services/data/util-general/utilGeneral.service';
import { UtilService } from 'src/app/services/util/util.service';

@Component({
  selector: 'app-compra-de-pin',
  templateUrl: './compra-de-pin.component.html',
  styleUrls: ['./compra-de-pin.component.scss']
})
export class CompraDePinComponent implements OnInit {

  /**
  * Enums y descripciones
  */
  tipoCliente: any = TipoCliente;
  pasosFormulario: any = PasosCotizacion;
  pasosCompraPin: any= PasosCompraPin;
  opcionTramites: any = OpcionTramite;
  cotizadorUrl: any = CotizadorUrl;
  /**
  * Modificadores de vistas
  */
  idGenerarReferencia: string = "btn-gen-ref-";
  tramites: any = Tramite;
  host: string = "";
  path: string = "";
  componentesCompra: ComponentesCompra = {
    datosBasicos: true,
    tipoTramite: false,
    seleccionCentro: false,
    datosPersonales: false,
    cuotaCeas: false,
    mediosPago: false,
    confirmarCompra: false,
    cotizacionAgendamiento: false,
    facturaElectronica: false
  };
  pagoPin: PagoPin = {
    usuario: {
      id: null,
      apellido: null,
      celular: null,
      correo: null,
      fechaNacimiento: null,
      genero: null,
      nombre: null,
      numDocumento: null,
      tipoDocumento: null,
      tipoDocumentoDescpcion: null
    },
    comprador: {
      id: null,
      apellido: null,
      celular: null,
      correo: null,
      fechaNacimiento: null,
      genero: null,
      nombre: null,
      numDocumento: null,
      tipoDocumento: null,
      tipoDocumentoDescpcion: null
    },
    compradorFE:{
      nit:null,
      razonSocial:null,
      nombreComercial:null,
      tipoPersona:null
    },
    clienteCompra: 0,
    tipoTramite: null,
    tipoTramite2: null,
    opcionTramite: null,
    validacionMapa: false,
    bancosPSE: [],
    costoCuotas: [],
    centroSeleccionado: null,
    costoCuotasSeleccionadas:0,
    conveniosPagoEfectivo: [],
    conveniosMediosPago: [],
    mediosPago: [],
    mediosPagoTodos: [],
    valorDiscriminadoCotizacion: null,
    valorDiscriminadoCotizacionAprox: null,
    categoria: '',
    categoria1: '',
    categoria2: '',
    categoriasActual: null,
    edadAspirante: 0,
    nomenclaturaIdentificacion: "",
    tipoRecaudoCtrl: null,
    tipoPagoEfectivo: null,
    tipoBancoPSE: null,
    tipoPersonaPSE: null,
    cuotas: null,
    referenciaGenerada: "",
    bancosPSESecure:[],
    pasarelaTuPago: false,
    urlCentro: false,
    categorias: [],
    obtenerPagoCrc: false,
    pasoCotizacion:0,
    tiposDeDocumento: [],
    tiposDeDocumentoFE: [],
    tipoPersonaFE:[],
    host: "",
    validarlogueado: false,
    tieneConvenios: false,
    centroIpValidacion: false,
    centroIpVolver: false,
    categoriasCentroIp: undefined,
    plantillas: undefined,
    analytics:{
      inicio: false,
      fin: false,
      label: ''
    },
    pilotoCEA: undefined,
    registroMiPerfil: 0,
    categoriasCea: [],
    categoriasCrc: [],
    tramiteInstructor:false,
    checkDaviplata:false,
    checkFacturaElectronica:false,
    checkFacturaElectronicaResumen:false
  };
  parameterValue!: string;
  parametroCompuesto!: string[];
  esModificacion: boolean = false;
  public successRequestFE: boolean = false;
  numeroRunt!: PermiteFacturaElectronicaRequest;
  enableConfirmFE: boolean = false;

  constructor(
    private readonly _route: ActivatedRoute,
    private readonly _routeGeneral: Router,
    private readonly _data: DataService,
    private readonly _utilGeneral: UtilGeneralService,
    private readonly _googleAnalyticsService: GoogleAnalyticsService,
    private readonly _mlApiService: MlapiService,
    private readonly _utils: UtilService,
    @Inject(DOCUMENT) private readonly document: Document,
    ) {
      this.validarIdCentro();
  }

  ngOnInit(): void {
    this.configurarNegocio();
    this.pagoPin.host = this.host = window.location.host;
    this.path = window.location.pathname;
    this.pagoPin.urlCentro = true;
    this.pagoPin.analytics.label = 'Compra '
      + (this.pagoPin.clienteCompra == this.tipoCliente.CRC ? 'CRC' : 'CEA')
      + (this.pagoPin.urlCentro ? ' Centro' : '');
    this.validarIpCentro();
    this.obtenerCategorias();
  }

  private validarIpCentro(){
    this._utilGeneral.ObtenerIp((data: currentDataIp)=>{
      if(data != null && data.estadoIp){
        if(this.pagoPin.urlCentro){
          if(!this.pagoPin.centroIpValidacion){
            if(data.tipoCliente === this.pagoPin.clienteCompra){
              if(data.centroSeleccionado === null){
                let centroActualIp : CentroActualIp =
                {
                  ip: data.ip,
                  negocio: (this.pagoPin.clienteCompra == this.tipoCliente.CRC ? "CRC" : "CEA")
                };
                this._data.consultaCentroActual(centroActualIp).subscribe((x:Centro[])=>{
                  if(x.length > 0)
                  {
                    this.pagoPin.centroSeleccionado = x[0];
                    this.pagoPin.centroIpValidacion = true;
                  }
                });
              }
              else{
                this.pagoPin.centroSeleccionado = data.centroSeleccionado;
                this.pagoPin.centroIpValidacion = true;
              }
            }
          }
        }
        else{
          this.document.location.href = data.urlCentro ;
        }
      }
      else if(data != null && data.tipoCliente === this.pagoPin.clienteCompra && data.centroSeleccionado != null){
        this.pagoPin.centroSeleccionado = data.centroSeleccionado;
        this.pagoPin.centroIpValidacion = true;
      }
    });
  }
  configurarNegocio() {
    this._route.params.subscribe((e: any) => {
      let parametro: string = e.sdcProduct;
      this.parametroCompuesto = parametro.split("-");
      parametro = this.parametroCompuesto[0];
      if(this.parameterValue == undefined && this.parametroCompuesto.length > 1){
        this._routeGeneral.navigate(["sdc/compra-de-pin/"+parametro]);
      }
      if(["CEA", "cea"].includes(parametro)){
        this.pagoPin.clienteCompra = this.tipoCliente.CEA;
        if(this.parameterValue == undefined){
          this.idGenerarReferencia = this.idGenerarReferencia + "cea-out-miperfil";
        }
      }
      else{
        this.pagoPin.clienteCompra = this.tipoCliente.CRC;
        if(this.parameterValue == undefined){
          this.idGenerarReferencia = this.idGenerarReferencia + "crc-out-miperfil";
        }
      }
      if(this.parameterValue != undefined && this.parameterValue != "") {
        let anteriorCliente: string = this.parameterValue.split('-')[0];
        if(parametro != anteriorCliente) {
          window.location.reload();
        }
      }
      this.parameterValue = this._route.snapshot.params['sdcProduct'];
    })
    if(this.pagoPin.pilotoCEA === undefined){
      this._data.obtenerParametrosPilotoCEA().subscribe(
        (x: PilotoCea) => this.pagoPin.pilotoCEA = x
      )
    }
  }

  onDatosBasicos(obj: PagoPin){
    this.enviarAnalytics();
    this.pagoPin = obj;
    this.desactivarTodo();
    if (this.pagoPin.edadAspirante >= 16 && this.pagoPin.edadAspirante < 18) {
      this.pagoPin.tipoTramite = this.tramites.PrimeraVez;
    }
    this.pagoPin.pasoCotizacion = this.pasosCompraPin.DatosBasicos;
    this.componentesCompra.tipoTramite = true;
    this.actualizarUrl(this.cotizadorUrl.TRAMITE);
  }

  onTipoTramite(obj: PagoPin){
    this.pagoPin = obj;
    if(this.pagoPin.pasoCotizacion !== this.pasosCompraPin.TipoTramiteComboMoto)
    {
      this.desactivarTodo();
      this.pagoPin.obtenerPagoCrc = false;
      this.componentesCompra.seleccionCentro = true;
      this.actualizarUrl(this.cotizadorUrl.MAPACENTRO);
    }
  }

  onSeleccionCentro(obj: PagoPin){
    this.pagoPin = obj;
    this.desactivarTodo();
    if(this.pagoPin.clienteCompra == this.tipoCliente.CRC){
      if(this.pagoPin.obtenerPagoCrc){
        /*Pasa al componente del confirmar compra*/
        this.componentesCompra.confirmarCompra = true;
        this.actualizarUrl(this.cotizadorUrl.CONFIRMACION);
      }
      else{
        /*Pasa al componente del cotizacion*/
        this.onCotizacionAgenda(obj);
      }
    }
    else {
      this.onCotizacionAgenda(obj);
    }
  }

  onCotizacionAgenda(obj: PagoPin){
    this.pagoPin = obj;
    this.desactivarTodo();
    if(this.pagoPin.obtenerPagoCrc && !this.pagoPin.urlCentro){
      this.componentesCompra.confirmarCompra = true;
      this.actualizarUrl(this.cotizadorUrl.CONFIRMACION);
    }
    else {
      this.componentesCompra.datosPersonales = true;
      this.actualizarUrl(this.cotizadorUrl.DATOSPERSONALES);
    }
  }

  onDatosPersonales(obj: PagoPin){
    this.pagoPin = obj;
    this.checkFEStatus((habilitada) => {
      if (!habilitada) {
        // Si NO aplica FE, Go a medios-pago
        this.desactivarTodo();
        if(this.pagoPin.clienteCompra == this.tipoCliente.CEA){
            this.componentesCompra.cuotaCeas = true;
            this.actualizarUrl(this.cotizadorUrl.CUOTAS);
          }
          else{
            this.componentesCompra.mediosPago = true;
            this.actualizarUrl(this.cotizadorUrl.MEDIOSPAGO);
          }
      } else {
        this.desactivarTodo();
        if(this.pagoPin.checkFacturaElectronica){
          this.componentesCompra.facturaElectronica = true;
          this.actualizarUrl(this.cotizadorUrl.FACTURAELECTRONICA);
        }
        else {
          this.componentesCompra.facturaElectronica = false;
          if(this.pagoPin.clienteCompra == this.tipoCliente.CEA){
            this.componentesCompra.cuotaCeas = true;
            this.actualizarUrl(this.cotizadorUrl.CUOTAS);
          }
          else{
            this.componentesCompra.mediosPago = true;
            this.actualizarUrl(this.cotizadorUrl.MEDIOSPAGO);
          }
        }
      }
    });
  }

  onVolver(estado: boolean){
    this.desactivarTodo();
    this.componentesCompra.datosBasicos = true;
    this.actualizarUrl(0);
  }

  onVolverTramite(estado: boolean){
    this.desactivarTodo();
    this.componentesCompra.tipoTramite = true;
    this.actualizarUrl(this.cotizadorUrl.TRAMITE);
  }

  onFacturaElectronica(obj: PagoPin){
    this.pagoPin = obj;
    this.desactivarTodo();
  
    if(this.pagoPin.clienteCompra == this.tipoCliente.CEA){
    this.componentesCompra.cuotaCeas = true;
    this.actualizarUrl(this.cotizadorUrl.CUOTAS);
    }
    else{
      this.componentesCompra.mediosPago = true;
      this.actualizarUrl(this.cotizadorUrl.MEDIOSPAGO);          
    }    
  }

  onCuotaCeas(obj: PagoPin){
    this.pagoPin = obj;
    this.desactivarTodo();
    this.componentesCompra.mediosPago = true;
    this.actualizarUrl(this.cotizadorUrl.MEDIOSPAGO);
  }

  onVolverSeleccionCentro(estado: boolean){
    this.desactivarTodo();
    this.componentesCompra.cotizacionAgendamiento = false;
    this.pagoPin.centroIpVolver = true;
    this.pagoPin.obtenerPagoCrc = false;
    this.componentesCompra.seleccionCentro = true;
    this.actualizarUrl(this.cotizadorUrl.MAPACENTRO);
  }

  onErrorValoresCentro(estado: boolean){
    this.desactivarTodo();
    this.pagoPin.obtenerPagoCrc = false;
    this.componentesCompra.seleccionCentro = true;
    this.actualizarUrl(this.cotizadorUrl.MAPACENTRO);
  }

  onMediosPago(obj: PagoPin){
    this.pagoPin = obj
    this.desactivarTodo();
    if(this.pagoPin.clienteCompra == this.tipoCliente.CEA){
      this.componentesCompra.confirmarCompra = true;
      this.actualizarUrl(this.cotizadorUrl.CONFIRMACION);
    }
    else{
      this.pagoPin.obtenerPagoCrc = true;
      this.componentesCompra.seleccionCentro = true;
    }

  }
  onVolverCentro(estado:boolean){
    if(estado)
      this.cambiarAVista(this.pasosFormulario.Mapa);
  }

  onVolverCuotaDatos(estado: boolean){
    this.desactivarTodo();
    if(this.pagoPin.clienteCompra == this.tipoCliente.CEA){
      this.componentesCompra.cuotaCeas = true;
      this.actualizarUrl(this.cotizadorUrl.CUOTAS);
    }
    else if (this.pagoPin.checkFacturaElectronica){
      this.componentesCompra.facturaElectronica = true;
      this.actualizarUrl(this.cotizadorUrl.FACTURAELECTRONICA);      
    }
    else{
      this.componentesCompra.datosPersonales = true;
      this.actualizarUrl(this.cotizadorUrl.DATOSPERSONALES);
    }
  }
  onVolverMediosPago(estado: boolean){
    this.desactivarTodo();
    this.componentesCompra.mediosPago = true;
    this.actualizarUrl(this.cotizadorUrl.MEDIOSPAGO);
  }

  onVolverDatosPersonales(estado: boolean){
    this.desactivarTodo();
    this.componentesCompra.datosPersonales = true;
    this.actualizarUrl(this.cotizadorUrl.DATOSPERSONALES);
  }

   onVolverCuotasCeas(estado: boolean){
    this.desactivarTodo();
    if(this.pagoPin.checkFacturaElectronica){
      this.componentesCompra.facturaElectronica = true;
      this.actualizarUrl(this.cotizadorUrl.FACTURAELECTRONICA);
    }else{
      this.componentesCompra.datosPersonales = true;
      this.actualizarUrl(this.cotizadorUrl.DATOSPERSONALES);
    }
    
  }

  cambiarAVista(vista: number) {

    this.desactivarTodo();
    this.pagoPin.centroIpVolver = true;
    if (vista === this.pasosFormulario.Resumen || vista === this.pasosFormulario.FacturaElectronica){
      this.checkFEStatus();
    }
    setTimeout(() => {
      switch(vista) {
        case this.pasosFormulario.DatosPersonales: {
          this.componentesCompra.datosPersonales = true;
          break;
        }
        case this.pasosFormulario.DatosBasicos: {
           this.componentesCompra.datosBasicos = true;
           break;
        }
        case this.pasosFormulario.Tramite:  {
          this.pagoPin.pasoCotizacion =
                                        this.pagoPin.opcionTramite == this.opcionTramites.simple
                                        ? this.pasosCompraPin.TipoTramiteSimple :this.pasosCompraPin.TipoTramiteComboCarro;
          this.componentesCompra.tipoTramite = true;
           break;
        }
        case this.pasosFormulario.TramiteDos:  {
          this.pagoPin.pasoCotizacion =
                                        this.pagoPin.opcionTramite == this.opcionTramites.simple
                                        ? this.pasosCompraPin.TipoTramiteSimple :this.pasosCompraPin.TipoTramiteComboMoto;
          this.componentesCompra.tipoTramite = true;
           break;
        }
        case this.pasosFormulario.Categoria: {
           this.pagoPin.pasoCotizacion =
                                        this.pagoPin.opcionTramite == this.opcionTramites.simple
                                        ? this.pasosCompraPin.SeleccionCentro :this.pasosCompraPin.CategoriaComboCarro;
          this.componentesCompra.tipoTramite = true;
           break;
        }
        case this.pasosFormulario.CategoriaDos: {
          this.pagoPin.pasoCotizacion =
                                       this.pagoPin.opcionTramite == this.opcionTramites.simple
                                       ? this.pasosCompraPin.CategoriasSimple :this.pasosCompraPin.CategoriaComboMoto;
          this.componentesCompra.tipoTramite = true;
          break;
        }
        case this.pasosFormulario.Mapa: {
          this.pagoPin.pasoCotizacion = this.pasosCompraPin.SeleccionCentro;
          this.pagoPin.centroIpVolver = true;
          this.pagoPin.obtenerPagoCrc = false;
          this.componentesCompra.seleccionCentro = true;
           break;
        }
        case this.pasosFormulario.cotizacionAgendamiento: {
          this.componentesCompra.cotizacionAgendamiento = true;
          break;
        }
        case this.pasosFormulario.Pagos: {
          this.componentesCompra.mediosPago = true;
           break;
        }
        case this.pasosFormulario.FacturaElectronica: {
          this.componentesCompra.facturaElectronica = true;
           break;
        }
        default: {
          this.desactivarTodo();
          this.componentesCompra.datosBasicos = true;
           break;
        }
     }
    });
  }

  desactivarTodo(){
    this.componentesCompra.datosBasicos = false;
    this.componentesCompra.tipoTramite = false;
    this.componentesCompra.seleccionCentro = false;
    this.componentesCompra.datosPersonales = false;
    this.componentesCompra.cuotaCeas = false;
    this.componentesCompra.mediosPago = false;
    this.componentesCompra.confirmarCompra = false;
    this.componentesCompra.cotizacionAgendamiento = false;
    this.componentesCompra.facturaElectronica = false;
  }

  validarIdCentro() {
    const navigation : any = this._routeGeneral.getCurrentNavigation();
    const state : any = navigation.extras.state as { data: Centro };
    state !== undefined ? this.pagoPin.centroSeleccionado = state.data["centroSeleccionado"] : false;
    if(this.pagoPin.centroSeleccionado != null){
      this.pagoPin.centroSeleccionado.categorias = undefined;
      this.pagoPin.centroIpValidacion = true;
    }else{
    }
  }

  enviarAnalytics(){
    if(!this.pagoPin.analytics.inicio){
      this.pagoPin.analytics.inicio = true;
      this._googleAnalyticsService.eventEmitter('event', 'Compra de PIN - Primera interacción', 'click', this.pagoPin.analytics.label, 0);
    }
  }

  private obtenerCategorias(){
    if (this.pagoPin.clienteCompra == this.tipoCliente.CRC) {
      if(this.pagoPin.categoriasCrc.length == 0){
        this._data.obtenerCategorias().subscribe(categorias => {
          this.pagoPin.categoriasCrc = categorias;
        });
      }
    } else{
      if(this.pagoPin.categoriasCea.length == 0){
        this._data.ObtenerCategoriasCentro((this.pagoPin.centroSeleccionado?.idCentro)!.toString()).subscribe(categorias => {
          this.pagoPin.categoriasCea = categorias;
        });
      }
    }
  }

  actualizarUrl(vista: number) {
    switch(vista) {
      case this.cotizadorUrl.TRAMITE:  {
        this._routeGeneral.navigate(["sdc/compra-de-pin/"+this.parametroCompuesto[0]+"-tramite"]);
        break;
      }
      case this.cotizadorUrl.MAPACENTRO: {
        this._routeGeneral.navigate(["sdc/compra-de-pin/"+this.parametroCompuesto[0]+"-mapa-centros"]);
        break;
      }
      case this.cotizadorUrl.AGENDAMIENTO: {
        this._routeGeneral.navigate(["sdc/compra-de-pin/"+this.parametroCompuesto[0]+"-agendamiento"]);
        break;
      }
      case this.cotizadorUrl.DATOSPERSONALES: {
        this._routeGeneral.navigate(["sdc/compra-de-pin/"+this.parametroCompuesto[0]+"-datos-personales"]);
        break;
      }
      case this.cotizadorUrl.MEDIOSPAGO: {
        this._routeGeneral.navigate(["sdc/compra-de-pin/"+this.parametroCompuesto[0]+"-medios-pago"]);
        break;
      }
      case this.cotizadorUrl.CUOTAS: {
        this._routeGeneral.navigate(["sdc/compra-de-pin/"+this.parametroCompuesto[0]+"-cuotas"]);
        break;
      }
      case this.cotizadorUrl.CONFIRMACION: {
        this._routeGeneral.navigate(["sdc/compra-de-pin/"+this.parametroCompuesto[0]+"-confirmacion"]);
        break;
      }
      case this.cotizadorUrl.FACTURAELECTRONICA: {
        this._routeGeneral.navigate(["sdc/compra-de-pin/"+this.parametroCompuesto[0]+"-factura-electronica"]);
        break;
      }
      default: {
        this._routeGeneral.navigate(["sdc/compra-de-pin/"+this.parametroCompuesto[0]]);
        break;
      }
    }
  }

  onFacturaElectronicaParam(val: boolean) {
    this.successRequestFE = val;
  }

  /**
   * Valida el estado de la facturación
   * necesaria cuando resumen.component se reinicializa
   */
  checkFEStatus(callback?: (habilitada: boolean) => void) {
  this.numeroRunt = { idRunt: this.pagoPin.centroSeleccionado?.codigoRUNT ?? 0 };
  this._data.PermiteFacturaElectronica(this.numeroRunt).subscribe((response) => {
    if (response?.datos && typeof response.datos.facturacionHabilitada !== 'undefined') {
      this.enableConfirmFE = response.datos.facturacionHabilitada;
    } else {
      this.enableConfirmFE = false;
    }
    
    this._data.setEnableConfirmFE(this.enableConfirmFE);
    if (callback) {
      callback(this.enableConfirmFE);
    }
  });
}
}