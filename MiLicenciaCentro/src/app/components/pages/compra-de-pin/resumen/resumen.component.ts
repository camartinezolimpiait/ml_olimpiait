import { Component, OnInit, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { PasosCotizacion } from 'src/app/enums/forms/Cotizador';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { shareReplay, map } from 'rxjs/operators';
import { BreakpointObserver } from '@angular/cdk/layout';
import { DescripcionTramite } from 'src/app/enums/Tramite';
import { TipoCliente } from 'src/app/enums/PinesOlimpia/TipoCliente';
import { PagoPin } from 'src/app/interfaces/compraPin/PagoPin';
import { Sexo } from 'src/app/enums/Sexo';
import { OpcionTramite } from 'src/app/enums/OpcionTramite';
import { TipoPago } from 'src/app/enums/PinesOlimpia/TipoPago';
import { PasosCompraPin } from 'src/app/enums/forms/PasosCompraPin';
import { TipoPersonaFE } from 'src/app/enums/PinesOlimpia/TipoPersonaFE';
import { PermiteFacturaElectronicaRequest } from 'src/app/interfaces/pago/FacturacionElectronica/PermiteFacturaElectronicaRequest';
import { DataService } from 'src/app/services/data/cotizador/data.service';
import { UtilService } from 'src/app/services/util/util.service';

@Component({
  selector: 'app-resumen',
  templateUrl: './resumen.component.html',
  styleUrls: ['./resumen.component.scss']
})
export class ResumenComponent implements OnInit, OnChanges {

  @Input() tipoRecaudo: FormControl | null = null;
  @Input() pagoPin!: PagoPin
  @Input() esConfirmacion!: boolean
  @Input() aplicaFE!: boolean;
  @Input() enableFE!: boolean;
  @Input() esModificacion: boolean = false;
  @Output() vistaFormulario: EventEmitter<number> = new EventEmitter<number>();

  mostrarTodoCotizacion: boolean = false;
  mostrarResumenMovil: boolean = false;
  descripcionTramite: any = DescripcionTramite;
  tipoCliente: any = TipoCliente;
  pasosFormulario: any = PasosCotizacion;
  sexos: any = Sexo;
  datosPersonales: boolean = false;
  opcionTramites: any = OpcionTramite;
  mediopago: string = "";
  ppt: number = 13;
  pasosCompraPin: any= PasosCompraPin;
  tipoPersonaFE: any = TipoPersonaFE;
  numeroRunt!: PermiteFacturaElectronicaRequest;
  enableConfirmFE: boolean = false;

  /**
  * Observa si el tamaño en el viewport es de 975px.
  * Si es menor, cambia el modo de navegación
  */
  isHandset$: Observable<boolean> = this._breakpointObserver
    .observe('(min-width: 640px)')
    .pipe(
      map(result => result.matches),
      shareReplay(),
    )

  mostrarResumen() { this.mostrarResumenMovil = !this.mostrarResumenMovil }


  mostrarTodoValores() {
    this.mostrarTodoCotizacion = !this.mostrarTodoCotizacion;
  }

  constructor(
    private readonly _breakpointObserver: BreakpointObserver,
    private readonly _data: DataService,
    private readonly _utils: UtilService,
  ) { }

  ngOnChanges(changes: SimpleChanges): void {
    // Se ejecuta al cambiar el componente
  }

  ngOnInit(): void {
    if(this.pagoPin.usuario.nombre != null
      && this.pagoPin.usuario.apellido != null
      && this.pagoPin.usuario.celular != null
      && this.pagoPin.usuario.correo != null
      && this.pagoPin.usuario.numDocumento != null
      && this.pagoPin.usuario.tipoDocumento != null){
        this.datosPersonales = true;
      }
      this.setMedioPago();

    this._data.enableConfirmFE$.subscribe(valor => {
      this.enableConfirmFE = valor;
    });

    this.checkFEStatus();
    
  }

  cambiarAVista(vista: number) {
  if (vista === this.pasosFormulario.FacturaElectronica) {

    this.numeroRunt = { idRunt: this.pagoPin.centroSeleccionado?.codigoRUNT ?? 0 };
    this._data.PermiteFacturaElectronica(this.numeroRunt).subscribe((response) => {
      if (response?.datos && response.datos.facturacionHabilitada) {
        //this.enableConfirmFE = true;
        this.vistaFormulario.emit(vista);
      } else {
        //this.enableConfirmFE = false;
        this._utils.abrirAlerta('En este momento, este centro no cuenta con facturación electrónica');
      }
    });
    return;
  }
  this.vistaFormulario.emit(vista);
}

getNombreDocumento(id: number | null | undefined): string {
  if (id == null) {
    return 'Tipo de documento no especificado';
  }
  const numeroId = String(id);

  const lista = this.pagoPin?.tiposDeDocumentoFE;

  if (!lista || !Array.isArray(lista)) {    
    return numeroId.toString();
  }

  const doc = lista.find((d: { idTipoSisec: string }) => d.idTipoSisec === numeroId);
  return doc ? doc.codigoACH : numeroId;
}

getTipoPersona(id: number | null | undefined): string { 
  if (id == null) {
    return 'Tipo de persona no especificado';
  }
  const numeroId = Number(id);

  const lista = this.pagoPin?.tipoPersonaFE;
  if (!lista || !Array.isArray(lista)) {
    return numeroId.toString(); // o 'Desconocido'
  }

  const doc = lista.find((d: { codigo: number }) => d.codigo === numeroId);

  return doc?.nombre ?? numeroId.toString();
}

  setMedioPago(){
    if (this.mediopago == "") {
      switch (this.tipoRecaudo?.value) {
        case TipoPago.Efectivo:
          this.mediopago = "Efectivo";
          break;
        case TipoPago.PSE:
          this.mediopago = "PSE";
          break;
        case TipoPago.NequiWompi:
          this.mediopago = "Nequi";
          break;
        case TipoPago.BancolombiaWompi:
          this.mediopago = "Bancolombia";
          break;
        case TipoPago.TdCWompi:
          this.mediopago = "Tarjeta de Credito";
          break;
        case TipoPago.Daviplata:
          this.mediopago ="Daviplata";
          break;
        default:
          this.mediopago = "NO SET";
          break;
      }
    }
  }

  
  /**
   * Valida el estado de la facturación
   * necesaria cuando resumen.component se reinicializa
   */
  checkFEStatus() {
    this.numeroRunt = { idRunt: this.pagoPin.centroSeleccionado?.codigoRUNT ?? 0 };
    this._data.PermiteFacturaElectronica(this.numeroRunt).subscribe((response) => {
      if (response?.datos && typeof response.datos.facturacionHabilitada !== 'undefined') {
        this.enableConfirmFE = response.datos.facturacionHabilitada;
      } else {
          this.enableConfirmFE = false;
        }
    });
  }
  
}
