import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { CategoriasTexto } from 'src/app/const/CategoriasTexto';
import { PasosCompraPin } from 'src/app/enums/forms/PasosCompraPin';
import { OpcionTramite } from 'src/app/enums/OpcionTramite';
import { TipoCliente } from 'src/app/enums/PinesOlimpia/TipoCliente';
import { Tramite } from 'src/app/enums/Tramite';
import { CategoriasPorCentroResponse } from 'src/app/interfaces/admin/adminAgenda/CategoriasPorCentroResponse';
import { ConsultaCategoriaPorCentro } from 'src/app/interfaces/admin/adminAgenda/ConsultaCategoriaPorCentro';
import { PagoPin } from 'src/app/interfaces/compraPin/PagoPin';
import { Categoria } from 'src/app/interfaces/cotizacion/Categoria';
import { MlapiService } from 'src/app/services/data/mlapi/mlapi.service';
import { UtilService } from 'src/app/services/util/util.service';

@Component({
  selector: 'app-seleccion-categorias',
  templateUrl: './seleccion-categorias.component.html',
  styleUrls: ['./seleccion-categorias.component.scss']
})
export class SeleccionCategoriasComponent implements OnInit {
  /**
  * Controles y formularios
  */
  tipoCliente: any = TipoCliente;
  compraPinForm!: FormGroup;
  categoriasActual: FormControl = new FormControl();
  readonly:boolean = false;
	mayoriaDeEdad: number = 18;
  tramites: any = Tramite;
  categoriasTexto:any = CategoriasTexto;
  mostrarTodoCotizacion: boolean = false;

  /**
  * Modificadores de vistas
  */
  vistaCategoriasCarro: boolean = false;
  vistaCategoriasMoto: boolean = false;
  habilitadoPSE: boolean = false;
  tieneConvenios: boolean = false;

  /**
  * Categorias
  */

  nombresCategorias!: string[];
  categoriasCarro!: Categoria[];
  categoriasPublico!: Categoria[];
  categoriasInstructor!: Categoria[];
  categoriasParticular!: Categoria[];
  categoriasMoto!: Categoria[];
  categoriasRecategorizacion!: Categoria[] | undefined;
  categoriasARecategorizar!: Categoria[];
  categoria1!: string;
  categoria2!: string;
  referenciaGenerada!: string;
  categoriasCentro!: string[];
  listaCategoriasCentro?: string[] | undefined | null;
  opcionTramites: any = OpcionTramite;
  mostrarRecategorizacionCombo:boolean=true;
  mostrarRecategorizacionCarro:boolean=true;
  mostrarRecategorizacionMoto:boolean=true;
  pasosCompraPin: any= PasosCompraPin;
  validacionManual:boolean = false;
  tempTipoTramite!:number | null;

  @Input() pagoPin!: PagoPin;
  @Output() pagoPinEvent = new EventEmitter<PagoPin>();
  @Output() pagoPinVolverEvent = new EventEmitter<boolean>();
  constructor(
    private readonly _formBuilder: FormBuilder,
    private readonly _mlApiService: MlapiService,
    private readonly _utils: UtilService,
  ) {}

  ngOnInit(): void {
    this.inicializarFormulario();
    this.procesarCategorias();
    this.calcularRecategorizacion(this.pagoPin.clienteCompra);
  }

  private inicializarFormulario()
  {

    this.compraPinForm = this._formBuilder.group({
      categoriaPrincipal: [null],
      categoriaSecundaria: [""],
    });

    if (this.pagoPin.tramiteInstructor) {
      switch (this.pagoPin.tipoTramite) {
        case Tramite.PrimeraVez:
          this.pagoPin.tipoTramite = Tramite.PrimeraVezInstructor;
          break;
        case Tramite.Recategorizar:
          this.pagoPin.tipoTramite = Tramite.RecategorizarInstructor;
          break;
      }
    }

    this.tempTipoTramite=this.pagoPin.tipoTramite;
    if(this.pagoPin.opcionTramite === this.opcionTramites.Combo )
    {
      if(this.pagoPin.pasoCotizacion === this.pasosCompraPin.CategoriaComboCarro)
      {
        if(this.pagoPin.tipoTramite === this.tramites.PrimeraVez)
          {
             this.mostrarCategoriasCarro();
          }
        else if(this.pagoPin.tipoTramite === this.tramites.Renovar || this.pagoPin.tipoTramite === this.tramites.Recategorizar)
        {
          this.mostrarRecategorizacionCarro =true;
          this.mostrarRecategorizacionMoto=false;
        }
        this.compraPinForm = this._formBuilder.group({
          categoriaPrincipal: [this.pagoPin.categoria1 !== ''? this.pagoPin.categoria1 : null],
          categoriaSecundaria: [""],
        });
      }
      else{
        this.tempTipoTramite=this.pagoPin.tipoTramite2;
        if(this.pagoPin.tipoTramite2 === this.tramites.PrimeraVez)
        {
          this.mostrarCategoriasMoto();
          this.compraPinForm = this._formBuilder.group({
            categoriaPrincipal: [null],
            categoriaSecundaria: [this.pagoPin.categoria2 !== ''? this.pagoPin.categoria2 : ''],
          });
        }
        else if(this.pagoPin.tipoTramite2 === this.tramites.Recategorizar)
        {
           this.mostrarRecategorizacionCarro =false;
           this.mostrarRecategorizacionMoto=false;
           this.compraPinForm = this._formBuilder.group({
            categoriaPrincipal: [this.pagoPin.categoria1 !== ''? this.pagoPin.categoria1 : ''],
            categoriaSecundaria: [this.pagoPin.categoria2 !== ''? this.pagoPin.categoria2 : ''],
          });
        }
        else
        {
          this.mostrarRecategorizacionCarro =false;
          this.mostrarRecategorizacionMoto=true;
          this.compraPinForm = this._formBuilder.group({
           categoriaPrincipal: [this.pagoPin.categoria2 !== ''? this.pagoPin.categoria2 : null],
           categoriaSecundaria: [this.pagoPin.categoria2 !== ''? this.pagoPin.categoria : ''],
         });
        }

      }
    }
    else{
      if( this.pagoPin.tipoTramite===this.tramites.Recategorizar||this.pagoPin.tipoTramite2 === this.tramites.Recategorizar){
        this.mostrarRecategorizacionMoto=false;
      }
      this.compraPinForm = this._formBuilder.group({
        categoriaPrincipal: [this.pagoPin.categoria1 !== '' ? this.pagoPin.categoria1 : null],
        categoriaSecundaria: [""],
      });
    }
  }

  mostrarCategoriasCarro() {
    this.vistaCategoriasCarro = !this.vistaCategoriasCarro;
  }

  mostrarCategoriasMoto() {
    this.vistaCategoriasMoto = !this.vistaCategoriasMoto;
  }

  mostrarTodoValores() {
    this.mostrarTodoCotizacion = !this.mostrarTodoCotizacion;
  }

  private procesarCategorias() {
    if (this.pagoPin.clienteCompra == this.tipoCliente.CRC) {
      this.mapearDescripcionesCortas(this.pagoPin.categoriasCrc)
        this.filtrarCategoriasPorEdadyServicio(this.pagoPin.categoriasCrc);
        this.categoriasARecategorizar = this.pagoPin.categoriasCrc.filter(x => !["A2", "B3", "C3"].includes(x.codigo));
        this.categoriasInstructor = [];
    } else {
      this.mapearDescripcionesCortas(this.pagoPin.categoriasCea)
      let listaCategorias = ['A1', 'A2', 'B1', 'B2', 'B3', 'C1', 'C2', 'C3', 'RC1'];
      let categorias;
      let tipotramiteTemp=0;
      if(this.pagoPin.tramiteInstructor){
        switch (this.pagoPin.tipoTramite) {
          case Tramite.PrimeraVezInstructor:
            tipotramiteTemp=Tramite.PrimeraVez;
            break;
          case Tramite.RecategorizarInstructor:
            tipotramiteTemp=Tramite.Recategorizar;
            break;
          default:
            tipotramiteTemp=this.pagoPin.tipoTramite!;
            break;
        }
      }else{
        tipotramiteTemp=this.pagoPin.tipoTramite!;
      }
      categorias = this.pagoPin.categoriasCea?.filter(x => listaCategorias.includes(x.codigo) && x.idTramite==tipotramiteTemp);
      this.categoriasInstructor = this.pagoPin.categoriasCea?.filter(x => x.codigo.includes("I") && x.idTramite==tipotramiteTemp);
      this.pagoPin.categoriasCentroIp = (this.pagoPin.tipoTramite == Tramite.PrimeraVezInstructor && this.pagoPin.tramiteInstructor) ||
          (this.pagoPin.tipoTramite == Tramite.RecategorizarInstructor && this.pagoPin.tramiteInstructor)
        ? this.categoriasInstructor
        : categorias;

      if(this.pagoPin.centroIpValidacion){
        this.cargarCategoriasIpCentro(()=>{
          categorias = this.pagoPin.categoriasCea?.filter(x => this.pagoPin.centroSeleccionado?.categorias?.includes(x.codigo));
          this.categoriasInstructor = categorias?.filter(x => x.codigo.includes("I") && x.idTramite==tipotramiteTemp)
        });
      }
      if(!this.pagoPin.tramiteInstructor){
        this.filtrarCategoriasPorEdadyServicio(categorias);
      }

    }
  }

  mapearDescripcionesCortas(catArray: Categoria[]) {
    catArray.forEach(element => {
      element.nombre = this.categoriasTexto[element.codigo]
    });
  }

  private filtrarCategoriasPorEdadyServicio(categorias: Categoria[]) {
    if (this.pagoPin.edadAspirante < 18) {
      this.pagoPin.categorias = categorias.filter(x => ["A1", "A2", "B1", "I"].includes(x.codigo));
    } else {
      this.pagoPin.categorias = categorias;
    }
    let categoriasCarroEdad = this.pagoPin.edadAspirante < 18 ? ["B1"] : ["B1", "C1"]
    this.categoriasCarro = categorias.filter(x => categoriasCarroEdad.includes(x.codigo));
    this.categoriasMoto = categorias.filter(x => x.codigo.includes("A"));
    this.categoriasParticular = categorias.filter(x => x.codigo.includes("B"));
    this.categoriasPublico = categorias.filter(x => x.codigo.includes("C"));
  }

  cargarCategoriasIpCentro(fn:any){
    let consulta: ConsultaCategoriaPorCentro = {
      centroId: this.pagoPin.centroSeleccionado?.idCentro
    };
    this._mlApiService.obtenerCategoriasPorCentro(consulta).subscribe((centroCategoria) => {
      this.cargarcategoriasCentro(centroCategoria)
      this.pagoPin.centroSeleccionado!.categorias = this.listaCategoriasCentro;
      fn();
    })
  }

  cargarcategoriasCentro(listadoCategorias: CategoriasPorCentroResponse[]) {
    if(this.pagoPin.categoriasCea != undefined)
    {
      let idCategoriasCentros: number[];
      idCategoriasCentros = listadoCategorias?.map((x) => x.idCategoria);
      this.listaCategoriasCentro = this.pagoPin.categoriasCea.filter(
        x => idCategoriasCentros.includes(x.idCategoria)).
        map(x =>
          x.codigo);
    }
  }

  calcularRecategorizacion(clienteCompra: number) {
    this.categoriasActual.valueChanges.subscribe((actual) => {
      let recategorizarCategorias = this.getRecategorizacionByCategoria(actual);
      this.categoriasRecategorizacion = this.pagoPin.categorias?.filter(x => recategorizarCategorias.includes(x.codigo))
    })
  }

  volverADatosBasicos(){
    if(this.pagoPin.opcionTramite === this.opcionTramites.simple)
    {
      this.pagoPin.categoria1='';
      this.pagoPin.categoria='';
    }
    this.pagoPin.pasoCotizacion=this.pagoPin.pasoCotizacion - 1
    this.pagoPinVolverEvent.emit(true);
  }

  calcularPin(){
    if(this.pagoPin.opcionTramite === this.opcionTramites.simple)
    {
      this.pagoPin.pasoCotizacion=this.pasosCompraPin.SeleccionCentro
      this.pagoPin.categoria1 = this.compraPinForm.get("categoriaPrincipal")!.value;
      this.pagoPin.categoria2 = this.compraPinForm.get("categoriaSecundaria")!.value;
      this.pagoPin.categoriasActual = this.categoriasActual.value;

      if (this.pagoPin.categoria1.includes("I")) {
        switch (this.pagoPin.tipoTramite) {
          case Tramite.PrimeraVezInstructor:
            this.pagoPin.tipoTramite = Tramite.PrimeraVez;
            break;
          case Tramite.RecategorizarInstructor:
            this.pagoPin.tipoTramite = Tramite.Recategorizar;
            break;
        }
      }

      if (this.pagoPin.tipoTramite == Tramite.Recategorizar
        && !this.pagoPin.categoria1.includes("I")) {
          let recategorizarCategorias = this.getRecategorizacionByCategoria(this.pagoPin.categoriasActual ?? "");
          if (!recategorizarCategorias.includes(this.pagoPin.categoria1)) {
            this._utils.abrirAlerta("No se puede recategorizar de " + this.pagoPin.categoriasActual + " a " + this.pagoPin.categoria1);
            return;
          }
      }

      this.pagoPinEvent.emit(this.pagoPin);
    }
    else if (this.pagoPin.pasoCotizacion === this.pasosCompraPin.CategoriaComboCarro)
    {
      this.pagoPin.categoria1 = this.compraPinForm.get("categoriaPrincipal")!.value;
      this.pagoPin.categoria = this.compraPinForm.get("categoriaPrincipal")!.value;
      this.pagoPin.categoriasActual = this.categoriasActual.value;
      this.pagoPinEvent.emit(this.pagoPin);
    }
    else
    {
      this.pagoPin.pasoCotizacion=this.pasosCompraPin.SeleccionCentro
       this.pagoPin.categoria2 = this.pagoPin.tipoTramite2 ==this.tramites.PrimeraVez
                                ? this.compraPinForm.get("categoriaSecundaria")!.value:this.compraPinForm.get("categoriaPrincipal")!.value;
      this.pagoPinEvent.emit(this.pagoPin);
    }

  }

  categoriasMotoInstructor(){
    return this.categoriasInstructor.filter(x=> x.codigo.includes("A"));
  }

  categoriasParticularInstructor(){
    return this.categoriasInstructor.filter(x=> x.codigo.includes("B"));
  }

  categoriasPublicoInstructor(){
    return this.categoriasInstructor.filter(x=> x.codigo.includes("C"));
  }

  validarCategoriaCombo(ctg: Categoria ){
    this.categoria1;
    this.categoria2;
    if (this.pagoPin.opcionTramite === this.opcionTramites.simple) {
      this.pagoPin.categoriasActual = this.categoriasActual.value;
    }

    if (this.pagoPin.pasoCotizacion === this.pasosCompraPin.CategoriaComboMoto){
      this.pagoPin.categoria2 = this.compraPinForm.get("categoriaPrincipal")!.value;
      this.pagoPin.categoriasActual = this.categoriasActual.value;
    }
    else if (this.pagoPin.pasoCotizacion === this.pasosCompraPin.CategoriaComboCarro){
      this.pagoPin.categoria1 = this.compraPinForm.get("categoriaPrincipal")!.value;
      this.pagoPin.categoria = this.compraPinForm.get("categoriaPrincipal")!.value;
      this.pagoPin.categoriasActual = this.categoriasActual.value;
    }

    this.pagoPin.categoriasActual = this.categoriasActual.value;

  }

  mostrarBotonSiguienteCombo(){
    if (this.pagoPin.opcionTramite === this.opcionTramites.Combo) {
      if (this.pagoPin.pasoCotizacion === this.pasosCompraPin.CategoriaComboCarro &&
        this.pagoPin.categoria1 != ''
      ) {
        return true
      }
      else if (this.pagoPin.pasoCotizacion === this.pasosCompraPin.CategoriaComboMoto &&
        this.pagoPin.categoria1 != '' && this.pagoPin.categoria2 != ''
      ) {
        return true
      }
    }
    else{
      return true;
    }
    return false;
  }

  getRecategorizacionByCategoria(categoria: string){
    switch(categoria) {
      case "A1": {
        return ['A2'];
      }
      case "B1": {
        return ['B2', 'C1'];
      }
      case "B2": {
        return ['B1', 'B3', 'C1', 'C2'];
      }
      case "B3": {
        return ['B1', 'B2', 'C3'];
      }
      case "C1": {
        return ['B1', 'B2', 'C2'];
      }
      case "C2": {
        return ['B1', 'B2', 'C1', 'C3'];
      }
      case "C3": {
        return ['B1', 'B2', 'C1', 'C2'];
      }
      default:
        return [];
    }
  }
}
