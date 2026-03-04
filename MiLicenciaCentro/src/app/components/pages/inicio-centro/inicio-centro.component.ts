import { Component, OnInit} from '@angular/core';
import { FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { DescripcionTipoClienteCentro, TipoCliente } from 'src/app/enums/PinesOlimpia/TipoCliente';
import { Centro } from 'src/app/interfaces/cotizacion/Centro';
import { currentDataIp } from 'src/app/interfaces/Otros/currentDataIp';
import { Comercio } from 'src/app/interfaces/pago/PinesOlimpia/Consulta/Comercio';
import { ConsultaComercios } from 'src/app/interfaces/pago/PinesOlimpia/Consulta/ConsultaComercios';
import { CompraPinService } from 'src/app/services/data/compra-pin/compra-pin.service';
import { DataService } from 'src/app/services/data/cotizador/data.service';
import { UtilGeneralService } from 'src/app/services/data/util-general/utilGeneral.service';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';

@Component({
  selector: 'app-inicio-centro',
  templateUrl: './inicio-centro.component.html',
  styleUrls: ['./inicio-centro.component.scss']
})
export class InicioCentroComponent implements OnInit {

  centros: Centro[] = [];
  centroSeleccionado: Centro | undefined;
  centrosCEA: Centro[] = [];
  centrosCRC: Centro[] = [];
  tipoCliente: any = TipoCliente;
  opcionTipoCliente: number | undefined;
  tipoCentro: FormControl = new FormControl();
  nombreCentro: FormControl = new FormControl();
  descripcionTipoClienteCentro = DescripcionTipoClienteCentro;
  servicio: number = 1;
  habilitarBoton: boolean = false;
  controlcontador: number = 0;
  filteredOptions!: Observable<any>;
  comercios: Comercio[] | undefined;
  _currentDataIp: currentDataIp | undefined | null = null;
  constructor(private readonly _mlCompraPin: CompraPinService,
              private readonly _data: DataService,
              private readonly _routeCompra: Router,
              private readonly _utilGeneral: UtilGeneralService,) { }

  ngOnInit(): void {
    this.cambiarServicio();
    this.obtenerComercios();
    this.obtenerListaCentros();
    this.validarIpCentro();
  }

  private obtenercentros(centros:Centro[],cambio:boolean=false){
    cambio ? this.nombreCentro.setValue(''):'' ;
    this.filteredOptions = this.nombreCentro.valueChanges
        .pipe(
          startWith(''),
          map(value => typeof value === 'string' ? value : value.nombre),
          map(name => name ? this._filter(name) : centros !==undefined ? centros.slice():null)
        );
  }

  displayFn(centro: Centro): string {
    return centro?.nombre ?? '';
  }

  private _filter(name: string): Centro[] {
    const filterValue = name.toLowerCase();
    return this.centros.filter(option => option.nombre.toLowerCase().includes(filterValue));
  }

  /**
   * Registrar el combo de tipode centro
   */
  cambiarServicio() {
    this.tipoCentro.valueChanges.subscribe((x) => {
      this.servicio = x;
      this.cambioParametrosBusqueda();
    });
  }

  /**
  * Cuando realiza el cambio del negocio
  */
  cambioParametrosBusqueda()
  {
    if(this.servicio != null)
    {
      this.centros = this.servicio == this.tipoCliente.CRC ? this.centrosCRC : this.centrosCEA;
      this.opcionTipoCliente= this.servicio == this.tipoCliente.CRC ? this.tipoCliente.CRC : this.tipoCliente.CEA;
      this.obtenercentros(this.centros,true);
      this.habilitarBoton=false;
    }
  }
/**
 *Obtiene los comercios
 */
  private obtenerComercios() {
    let consulta: ConsultaComercios = {
      idTipoPin: 2,
      idRunt: null
    };
    this._data.seleccionarComerciosPorTipo(consulta).subscribe((x: Comercio[]) => { this.comercios = x;});
  }

  /**
   * se obtienen los centros
   */
  private obtenerListaCentros() {
    if(this.tipoCliente.CRC){
      this._mlCompraPin
      .consultarTodosCentroNegocio({
        id: 0,
        plataforma: "CRC",
      })
      .subscribe((listadoCentros:Centro[]) => {
        this.centrosCRC = listadoCentros;
        this.cambiarInterfaz();
      });
    }
    else (this.tipoCliente.CEA )
    {
      this._mlCompraPin
        .consultarTodosCentroNegocio({
          id: 0,
          plataforma: "CEA",
        })
        .subscribe((listadoCentros:Centro[]) => {
          this.cargarCentrosCea(listadoCentros);
      });
    }
  }

  /**
   *
   * @param listadoCentros
   */
  private cargarCentrosCea(listadoCentros: Centro[]) {
    let listadoRuntHabilitados: string[] | undefined = this.comercios?.map((a) => a.idRunt);
    this.centrosCEA = listadoCentros?.filter((x) =>
      listadoRuntHabilitados?.includes(x.codigoRUNT?.toString())
    );
    this.cambiarInterfaz();
  }
  /**
   *
   */
  private cambiarInterfaz() {
    if ( this.tipoCliente.CRC)
    {
      this.centros = this.centrosCRC;
      this.tipoCentro.setValue(this.tipoCliente.CRC);
    } else {
      this.centros = this.centrosCEA;
      this.tipoCentro.setValue(this.tipoCliente.CEA);
    }
  }
  /**
   *
   * @param item
   */
   public selectEvent(centroSeleccionado: Centro | null) {
    if (centroSeleccionado !== null) {
      this.habilitarBoton = true;
      this.centroSeleccionado = centroSeleccionado;
    }
    else {
      if(this._currentDataIp != null){
        let response = this._utilGeneral.asignarCentroCurrentDataIp(this.centroSeleccionado, this.opcionTipoCliente, () => {});
        if(response != null)
        {
          this.redireccionCentro(this.centroSeleccionado, this.opcionTipoCliente);
        }
        else{
          document.location.reload();
        }
      }
      else{
        this._utilGeneral.crearCentroCurrentDataIp(this.centroSeleccionado, this.opcionTipoCliente, ()=>{
          this.redireccionCentro(this.centroSeleccionado, this.opcionTipoCliente);
        });
      }
    }
  }

  quitarAbreviaciones(input: string) {
    let filtroAvenidaCarrera = /\b(ak|acr)\b/;
    let filtroAvenidaCalle = /\b(ac|avcl)\b/;
    let filtroAvenida = /\b(ave|av)\b/;
    let filtroCalle = /\b(c|cl|cll|clle|cale|call)\b/;
    let filtroCarrera = /\b(cr|cra|k|kr|kra|crr|car)\b/;
    let filtroTransversal = /\b(trans|transv|tranv|trv|tv|tvr)\b/;
    let filtroDiagonal = /\b(dg|dig|diag)\b/;
    let filtroVereda = /\b(vr|vda)\b/;
    let filtroManzana = /\b(mza)\b/;
    let filtroKilometro = /\b(km|kto)\b/;
    let filtroGuiones = /(\s?–\s?|\s?-\s?)/g;
    let filtroEspeciales = /[^a-zA-Z0-9-# ]/g;
    let filtroNum = /\s(no|n)\s/g;

    input = input.replace(filtroAvenidaCarrera, "avenida carrera");
    input = input.replace(filtroAvenidaCalle, "avenida calle");
    input = input.replace(filtroAvenida, "avenida");
    input = input.replace(filtroCalle, "calle");
    input = input.replace(filtroCarrera, "carrera");
    input = input.replace(filtroTransversal, "transversal");
    input = input.replace(filtroDiagonal, "diagonal");
    input = input.replace(filtroVereda, "vereda");
    input = input.replace(filtroManzana, "manzana");
    input = input.replace(filtroKilometro, "kilometro");
    input = input.replace(filtroGuiones, " - ");
    input = input.replace(filtroEspeciales, "");
    input = input.replace(filtroNum, " # ");

    return input;
  }

  private redireccionCentro(centro: Centro | undefined, tipoCliente: number | undefined){
    if (this.tipoCliente.CEA === tipoCliente) {
      this._routeCompra.navigate(['/centros', 'ml', 'cea'], { state: { data: { centro } } });
    }
    else {
      this._routeCompra.navigate(['/centros', 'ml', 'crc'], { state: { data: { centro } } });
    }
  }

  private validarIpCentro(){
    this._utilGeneral.ObtenerIp((data: currentDataIp)=>{
      this._currentDataIp = data;
      if(data != null && data.centroSeleccionado != null && data.tipoCliente != null){
        this.redireccionCentro(data.centroSeleccionado, data.tipoCliente);
      }
    });
  }
}
