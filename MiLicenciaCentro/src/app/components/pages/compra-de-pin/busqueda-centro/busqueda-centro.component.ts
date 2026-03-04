import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { DescripcionTipoCliente, TipoCliente } from 'src/app/enums/PinesOlimpia/TipoCliente';
import { ConsultaCentroPorCategoria } from 'src/app/interfaces/compraPin/ConsultaCentroPorCategoria';
import { Categoria } from 'src/app/interfaces/cotizacion/Categoria';
import { Centro } from 'src/app/interfaces/cotizacion/Centro';
import { Comercio } from 'src/app/interfaces/pago/PinesOlimpia/Consulta/Comercio';
import { ConsultaComercios } from 'src/app/interfaces/pago/PinesOlimpia/Consulta/ConsultaComercios';
import { PilotoCea } from 'src/app/interfaces/pago/SecurePay/PilotoCea';
import { CompraPinService } from 'src/app/services/data/compra-pin/compra-pin.service';
import { DataService } from 'src/app/services/data/cotizador/data.service';

@Component({
  selector: 'app-busqueda-centro',
  templateUrl: './busqueda-centro.component.html',
  styleUrls: ['./busqueda-centro.component.scss']
})
export class BusquedaCentroComponent implements OnInit {

  centros!: Centro[];
  centroSeleccionado!: Centro;
  centrosCEA!: Centro[];
  centrosCRC!: Centro[];
  comercios!: Comercio[];
  categoriasCentro: Categoria[] | null = null;
  tipoCliente: any = TipoCliente;
  listaCategoriasCentro!: any[];
  pilotoCEA!: PilotoCea;
  clienteMapa!: number;
  tipoCentro: FormControl = new FormControl();
  descripcionTipoCliente = DescripcionTipoCliente;
  public placeholder  = 'Ingrese Nombre del centro o Runt o departamento o ciudad';
  keyword = 'busqueda';
  mostrarDatosCentro:boolean=false;
  servicio:number=1;
  habilitarBoton:boolean=false;
  @ViewChild('auto') auto: any;

  @Input() mostrarFooter: boolean = true;
  @Input() categoriaDesdeForm: any;
  @Input() tramite: any;
  @Input() clienteCompra: any;
  @Output() centroSeleccionadoMapa: EventEmitter<Centro> = new EventEmitter<Centro>();
  constructor(private readonly _mlCompraPin: CompraPinService,
              private readonly _data: DataService,
              private readonly _route: ActivatedRoute,
              private readonly _routeCompra: Router,) { }

  ngOnInit(): void {
    this.configurarNegocio();
    this.cambiarServicio();
    this.obtenerComercios();
    this.obtenerListaCentros();
  }

  /**
   *
   */
  private configurarNegocio() {
    this._route.params.subscribe((e: any) => {
      if(Object.entries(e).length === 0)
      {
        e = { sdcProduct: (this.clienteCompra == this.tipoCliente.CEA ? "cea" : "crc") };
      }
      else{
        let parametroCompuesto: string[] = e.sdcProduct.split("-");
        e = { sdcProduct: parametroCompuesto[0] };
      }
      this.clienteMapa = ["CEA", "cea"].includes(e.sdcProduct)
        ? this.tipoCliente.CEA
        : this.tipoCliente.CRC;
      this.tipoCentro.setValue(this.clienteMapa);

    });
    this._data
      .obtenerParametrosPilotoCEA()
      .subscribe((x: PilotoCea) => (this.pilotoCEA = x));
  }

  cambiarServicio() {
    this.tipoCentro.valueChanges.subscribe((x) => {
      this.servicio = x;
      this.cambioParametrosBusqueda();
    });
  }
  cambioParametrosBusqueda()
  {
    if(this.servicio != null)
    {
      if(this.servicio == this.tipoCliente.CRC)
      {
        this.centros = this.centrosCRC;
        this.clienteMapa=this.tipoCliente.CRC
      }
      else
      {
        this.centros = this.centrosCEA;
        this.clienteMapa=this.tipoCliente.CEA
      }
    }
  }
/**
 *
 */
  private obtenerComercios() {
    let consulta: ConsultaComercios = {
      idTipoPin: 2,
      idRunt: null
    };
    this._data
      .seleccionarComerciosPorTipo(consulta)
      .subscribe((x: Comercio[]) => {
        this.comercios = x;
      });
  }

  /**
   *
   */
  private obtenerListaCentros() {
    if(this.clienteMapa == this.tipoCliente.CRC){
      this._mlCompraPin
      .consultarTodosCentroNegocio({
        id: 0,
        plataforma: "CRC",
      })
      .subscribe((listadoCentros) => {
        this.centrosCRC = listadoCentros;
        this.cambiarInterfaz();
      });
    } else {
      if (this.categoriaDesdeForm) {
        let consulta: ConsultaCentroPorCategoria = {
          categoriaId: this.categoriaDesdeForm,
          tramiteId: +this.tramite,
        };
        this._mlCompraPin
          .consultarCentroPorCategoria(consulta)
          .subscribe((listadoCentros) => {
            this.cargarCentrosCea(listadoCentros);
          });
      }
    }
    if(this.clienteCompra === undefined){
      this._mlCompraPin
        .consultarTodosCentroNegocio({
          id: 0,
          plataforma: "CEA",
        })
        .subscribe((listadoCentros) => {
          this.cargarCentrosCea(listadoCentros);
      });
    }
  }

  /**
   *
   * @param listadoCentros
   */
  private cargarCentrosCea(listadoCentros: Centro[]) {
    let listadoRuntHabilitados: string[] = this.comercios?.map((a) => a.idRunt);
    this.centrosCEA = listadoCentros?.filter((x) =>
      listadoRuntHabilitados?.includes(x.codigoRUNT?.toString())
    );
    this.cambiarInterfaz();
  }

/**
 *
 */
  private cambiarInterfaz() {
    if (
      this.clienteMapa == this.tipoCliente.CRC ||
      this.clienteCompra == this.tipoCliente.CRC
    ) {
      this.centros = this.centrosCRC;
      this.tipoCentro.setValue(this.tipoCliente.CRC);
    } else {
      this.centros = this.centrosCEA?.filter((x) =>
        this.pilotoCEA.runtCentrosPiloto?.includes(x.codigoRUNT)
      );
      this.tipoCentro.setValue(this.tipoCliente.CEA);
    }
  }
  /**
   *
   * @param item
   */
  public selectEvent(centroSeleccionado: any) {
    if (centroSeleccionado !== null)
    {
      this.habilitarBoton=true;
      this.centroSeleccionado =centroSeleccionado;
      this.mostrarDatosCentro=true;
      this.centroSeleccionadoMapa.emit(centroSeleccionado)
      this.auto.clear();
    }
   else
   {
     centroSeleccionado=this.centroSeleccionado;
    if ( this.clienteMapa == this.tipoCliente.CEA ||
      this.clienteCompra == this.tipoCliente.CEA) {
      this._routeCompra.navigate(['/sdc', 'compra-de-pin', 'cea'], { state: { data: { centroSeleccionado } } });
    }
    else {
      this._routeCompra.navigate(['/sdc', 'compra-de-pin', 'crc'], { state: { data: { centroSeleccionado } } });
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
}
