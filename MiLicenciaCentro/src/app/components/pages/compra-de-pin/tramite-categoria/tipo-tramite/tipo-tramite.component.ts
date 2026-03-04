import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PasosCompraPin } from 'src/app/enums/forms/PasosCompraPin';
import { OpcionTramite } from 'src/app/enums/OpcionTramite';
import { TipoCliente } from 'src/app/enums/PinesOlimpia/TipoCliente';
import { DescripcionTramite, ListaSeleccionTramite, Tramite } from 'src/app/enums/Tramite';
import { PagoPin } from 'src/app/interfaces/compraPin/PagoPin';
import { SeleccionTramite } from 'src/app/interfaces/compraPin/SeleccionTramite';
import { TiposTramitesHabilitados } from 'src/app/interfaces/compraPin/TramitesHabilitados';
import { Categoria } from 'src/app/interfaces/cotizacion/Categoria';
import { enumToArrObj } from 'src/app/interfaces/Otros/enumToArrObj';

@Component({
  selector: 'app-tipo-tramite',
  templateUrl: './tipo-tramite.component.html',
  styleUrls: ['./tipo-tramite.component.scss']
})
export class TipoTramiteComponent implements OnInit {
  /**
  * Controles y formularios
  */
  tipoCliente: any = TipoCliente;
  compraPinForm!: FormGroup
  readonly:boolean = false;
	mayoriaDeEdad: number = 18;
  tramites: any = Tramite;
  listaTramites: SeleccionTramite[] = ListaSeleccionTramite;
  descripcionTramite: any = DescripcionTramite;
  opcionTramites: any = OpcionTramite;
  pasosCompraPin: any= PasosCompraPin;
  validacionManual:boolean = false;
  listadoIdAceptados:number[]=[];
  listadoIdAceptadosInstructor:number[]=[];
  tiposTramitesHabilitados:TiposTramitesHabilitados={} as TiposTramitesHabilitados;;
  habilitarInstructor:boolean = false;
  @Input() pagoPin!: PagoPin;
  @Output() pagoPinEvent = new EventEmitter<PagoPin>();
  @Output() pagoPinVolverEvent = new EventEmitter<number>();
  constructor(
    private readonly _formBuilder: FormBuilder,
  ) {}

  ngOnInit(): void {

    this.inicializarFormulario();
    this.cambiarTipoTramite();
  }
  

  private inicializarFormulario()
  {
    if(this.pagoPin.tramiteInstructor){
      switch (this.pagoPin.tipoTramite) {
        case Tramite.PrimeraVez:
          this.pagoPin.tipoTramite = Tramite.PrimeraVezInstructor;
          break;
        case Tramite.Recategorizar:
          this.pagoPin.tipoTramite = Tramite.RecategorizarInstructor;
          break;
      }
    }

    this.compraPinForm = this._formBuilder.group({
      tipoTramite: ["", Validators.required]
    });
    if (this.pagoPin.pasoCotizacion === this.pasosCompraPin.TipoTramiteSimple)
    {
      this.compraPinForm = this._formBuilder.group({
        tipoTramite: [this.pagoPin.tipoTramite ?? "", Validators.required]
      });
    }
    else if(this.pagoPin.pasoCotizacion === this.pasosCompraPin.TipoTramiteComboCarro)
    {
      this.compraPinForm = this._formBuilder.group({
        tipoTramite: [this.pagoPin.tipoTramite ?? "", Validators.required]
      });
    }
    else if(this.pagoPin.pasoCotizacion === this.pasosCompraPin.TipoTramiteComboMoto)
    {
      this.compraPinForm = this._formBuilder.group({
        tipoTramite: [this.pagoPin.tipoTramite2 ?? "", Validators.required]
      });
    }

    this.listaTramites = this.listaTramites.filter(x => x.id != 0);
    this.TratamientoTramites();
  }
  
  avanzar(){
    if (this.pagoPin.pasoCotizacion === this.pasosCompraPin.TipoTramiteComboMoto)
    {
      this.pagoPin.tipoTramite2 = this.compraPinForm.get("tipoTramite")!.value;
    }
    else{
      this.pagoPin.tipoTramite = this.compraPinForm.get("tipoTramite")!.value;
      this.validarTipoTramite();

    }
    this.pagoPinEvent.emit(this.pagoPin);
  }
  cambiarTipoTramite() {
    this.compraPinForm.valueChanges.subscribe((val) => {
      if(this.pagoPin.pasoCotizacion !==this.pasosCompraPin.TipoTramiteComboMoto)
      {
        this.pagoPin.categoria1='';
      }
    });

  }
  volver(){
    this.pagoPin.pasoCotizacion = this.pagoPin.opcionTramite === this.opcionTramites.simple ? this.pasosCompraPin.CantidadTramites : this.pagoPin.pasoCotizacion - 1;
    this.pagoPin.categoria1= this.pagoPin.pasoCotizacion === this.pasosCompraPin.TipoTramiteComboCarro ? '' :this.pagoPin.categoria1;
    this.pagoPinVolverEvent.emit(this.pagoPin.pasoCotizacion);
  }

  setTramite(tramite: enumToArrObj){
    return this.descripcionTramite[tramite.index as Tramite]
  }
  TratamientoTramites(){
    if(this.pagoPin.clienteCompra == this.tipoCliente.CEA)
    {
      /* LLenamos listados de ids segun las categorias consultadas*/
      this.listadoIdAceptados=this.cargaDinamicaListados(this.pagoPin.categoriasCea,false);
      this.listadoIdAceptadosInstructor=this.cargaDinamicaListados(this.pagoPin.categoriasCea,true);
      /* LLenamos el objeto de tramites habilitados segun lo que este habilitado*/
      this.tratarCategoriasHabilitadas();
      /* Filtramos los tramites segun los tramites habilitados*/
      this.filtradoTramite();        
    }
  }

  cargaDinamicaListados(categorias: Categoria[], instructor: boolean): number[] {
    if (!instructor) {
      return categorias
        .filter(obj => 
          (obj.codigo.includes('A') && !obj.codigo.includes('IA')) ||
          (obj.codigo.includes('B') && !obj.codigo.includes('IB')) ||
          (obj.codigo.includes('C') && !obj.codigo.includes('IC') && 
           !obj.codigo.includes('Curso') && !obj.codigo.includes('RC1'))
        )
        .map(obj => obj.idCategoria);
    } else {
      return categorias
        .filter(obj => 
          obj.codigo.includes('IA') || 
          obj.codigo.includes('IB') || 
          obj.codigo.includes('IC')
        )
        .map(obj => obj.idCategoria);
    }
  }
  tratarCategoriasHabilitadas(){
    this.tiposTramitesHabilitados.primeraVez = this.pagoPin.categoriasCea.some(x => 
      x.idTramite == 1 && this.listadoIdAceptados.includes(x.idCategoria)
    );

    this.tiposTramitesHabilitados.recategorizacion = this.pagoPin.categoriasCea.some(x => 
      x.idTramite == 3 && this.listadoIdAceptados.includes(x.idCategoria));

    this.tiposTramitesHabilitados.primeraVezInstructor = this.pagoPin.categoriasCea.some(x => 
      x.idTramite == 1 && this.listadoIdAceptadosInstructor.includes(x.idCategoria)
    );

    this.tiposTramitesHabilitados.recategorizacionInstructor = this.pagoPin.categoriasCea.some(x => 
      x.idTramite == 3 && this.listadoIdAceptadosInstructor.includes(x.idCategoria)
    );

    this.tiposTramitesHabilitados.tramiteNormal = this.tiposTramitesHabilitados.primeraVez || this.tiposTramitesHabilitados.recategorizacion;

    this.tiposTramitesHabilitados.tramiteInstructor = this.tiposTramitesHabilitados.primeraVezInstructor || this.tiposTramitesHabilitados.recategorizacionInstructor;
  }
  filtradoTramite(){
    if(!this.tiposTramitesHabilitados.primeraVez){
      this.listaTramites = this.listaTramites.filter(x => x.id != Tramite.PrimeraVez);
    }
    if(!this.tiposTramitesHabilitados.recategorizacion){
      this.listaTramites = this.listaTramites.filter(x => x.id != Tramite.Recategorizar);
    }
    if(!this.tiposTramitesHabilitados.primeraVezInstructor){
      this.listaTramites = this.listaTramites.filter(x => x.id != Tramite.PrimeraVezInstructor);
    }
    if(!this.tiposTramitesHabilitados.recategorizacionInstructor){
      this.listaTramites = this.listaTramites.filter(x => x.id != Tramite.RecategorizarInstructor);
    }
  }
  validarTipoTramite(){
    switch(this.pagoPin.tipoTramite)
    {
      case Tramite.PrimeraVez:
        this.pagoPin.tramiteInstructor=false;
      break;
      case Tramite.Recategorizar:
        this.pagoPin.tramiteInstructor=false;
      break;
      case Tramite.PrimeraVezInstructor:
      this.pagoPin.tramiteInstructor=true;
      this.pagoPin.tipoTramite=Tramite.PrimeraVezInstructor;
      break;
      case Tramite.RecategorizarInstructor:
        this.pagoPin.tipoTramite=Tramite.RecategorizarInstructor;
        this.pagoPin.tramiteInstructor=true;
      break;
    }
  }
}
