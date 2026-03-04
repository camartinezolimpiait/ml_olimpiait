import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PasosCompraPin } from 'src/app/enums/forms/PasosCompraPin';
import { DescripcionOpcionTramite, OpcionTramite } from 'src/app/enums/OpcionTramite';
import { TipoCliente } from 'src/app/enums/PinesOlimpia/TipoCliente';
import { DescripcionTramite, Tramite } from 'src/app/enums/Tramite';
import { PagoPin } from 'src/app/interfaces/compraPin/PagoPin';

@Component({
  selector: 'app-tramite-categoria',
  templateUrl: './tramite-categoria.component.html',
  styleUrls: ['./tramite-categoria.component.scss']
})
export class TramiteCategoriaComponent implements OnInit {
  /**
  * Controles y formularios
  */
  tipoCliente: any = TipoCliente;
  compraPinForm!: FormGroup
  readonly:boolean = false;
	mayoriaDeEdad: number = 18;
  tramites: any = Tramite;
  descripcionTramite: any = DescripcionTramite;
  opcionTramites: any = OpcionTramite;
  descripcionOpcionTramite: any = DescripcionOpcionTramite;
  componentePrincipal: boolean = true;
  componenteTramite: boolean = false;
  componenteCategoria: boolean = false;
  validacionManual:boolean = false;
  pasosCompraPin: any= PasosCompraPin;

  @Input() pagoPin!: PagoPin;
  @Output() pagoPinEvent = new EventEmitter<PagoPin>();
  @Output() pagoPinVolverEvent = new EventEmitter<boolean>();
  constructor(
    private readonly _formBuilder: FormBuilder,
  ) {}

  ngOnInit(): void {
    this.inicializarFormulario();
    this.validarPasosFormulario();
    this.cambiarTramite();
  }

  private inicializarFormulario()
  {
    this.compraPinForm = this._formBuilder.group({
      opcionTramite: ["", Validators.required]
    });
  }

  cambiarTramite() {
    this.compraPinForm.valueChanges.subscribe((val) => {
        this.pagoPin.categoria1 = '';
        this.pagoPin.categoria2 = ''
        this.pagoPin.tipoTramite = null;
        this.pagoPin.tipoTramite2 = null;
    });
  }
  /**
   * Realiza una validacion de los datos que se tienen precargados para asi mostrar el formulario correspondiente
   */
  validarPasosFormulario()
  {
    this.compraPinForm = this._formBuilder.group({
      opcionTramite: [ this.pagoPin.clienteCompra == this.tipoCliente.CEA? this.opcionTramites.simple : this.pagoPin.opcionTramite ?? "", Validators.required],
    });
    if(this.pagoPin.clienteCompra == this.tipoCliente.CEA){
      this.pagoPin.opcionTramite = this.opcionTramites.simple;
    }
    if(this.pagoPin.opcionTramite === this.opcionTramites.simple)
    {
      if(this.pagoPin.pasoCotizacion === this.pasosCompraPin.SeleccionCentro)
      {
        this.pagoPin.pasoCotizacion=this.pasosCompraPin.TipoTramiteSimple;
        this.componentePrincipal = false;
        this.onTipoTramite(this.pagoPin)
      }
      else
      {
        this.inicarSeleccion();
      }
    }
    else
    {
      if(this.pagoPin.pasoCotizacion === this.pasosCompraPin.SeleccionCentro
        || this.pagoPin.pasoCotizacion === this.pasosCompraPin.CategoriaComboMoto
        || this.pagoPin.pasoCotizacion === this.pasosCompraPin.CategoriaComboCarro )
      {
        this.pagoPin.pasoCotizacion=  this.pagoPin.pasoCotizacion === this.pasosCompraPin.CategoriaComboCarro
                                      ? this.pasosCompraPin.TipoTramiteComboCarro: this.pasosCompraPin.TipoTramiteComboMoto;
        this.componentePrincipal = false;
        this.onTipoTramite(this.pagoPin)
      }
      else if(this.pagoPin.pasoCotizacion === this.pasosCompraPin.TipoTramiteComboMoto)
        {
          this.pagoPin.opcionTramite = this.compraPinForm.get("opcionTramite")!.value;
          this.componentePrincipal = false;
          this.componenteTramite = true;
        }
        else if(this.pagoPin.pasoCotizacion === this.pasosCompraPin.TipoTramiteComboCarro)
        {
          this.inicarSeleccion();
        }
    }
  }

  inicarSeleccion(){
    this.pagoPin.opcionTramite = this.compraPinForm.get("opcionTramite")!.value;
    this.componentePrincipal = false;
    this.componenteTramite = true;
    this.pagoPin.pasoCotizacion = this.pagoPin.opcionTramite == this.opcionTramites.simple
                                    ? this.pasosCompraPin.TipoTramiteSimple :this.pasosCompraPin.TipoTramiteComboCarro;
  }

  onTipoTramite(obj: PagoPin){
    this.pagoPin.pasoCotizacion = this.pagoPin.pasoCotizacion + 1;
    this.pagoPin = obj;
    this.componenteTramite = false;
    this.componenteCategoria = true;
  }

  onSeleccionCategoria(obj: PagoPin){
    this.pagoPin = obj;
    if (this.pagoPin.opcionTramite === this.opcionTramites.Combo )
    {
      if (this.pagoPin.pasoCotizacion === this.pasosCompraPin.CategoriaComboCarro)
      {
        this.pagoPin.pasoCotizacion=this.pagoPin.pasoCotizacion + 1
        this.componenteTramite = true;
        this.componenteCategoria = false;
        this.pagoPinEvent.emit(this.pagoPin);
      }
      else
      {
        this.componenteCategoria = false;
        this.pagoPinEvent.emit(this.pagoPin);
      }
    }
    else{
      this.componenteCategoria = false;
      this.pagoPinEvent.emit(this.pagoPin);
    }

  }

  onVolverPrincipal(estado: number){
    this.pagoPin.pasoCotizacion=estado;
    if (this.pagoPin.opcionTramite == this.opcionTramites.simple)
    {
      if(this.pagoPin.clienteCompra == this.tipoCliente.CEA){
        this.volver();
      }
      else{
        this.pagoPin.tipoTramite= null;
        this.componentePrincipal = true;
        this.componenteTramite = false;
        this.componenteCategoria = false;
      }
    }
    else{
      if(this.pagoPin.pasoCotizacion === this.pasosCompraPin.CategoriaComboCarro)
      {
        this.componentePrincipal = false;
        this.componenteTramite = false;
        this.componenteCategoria = true;
      }
      else
      {
        this.componentePrincipal = true;
        this.componenteTramite = false;
        this.componenteCategoria = false;
      }
    }
  }

  onVolverTramite(estado: boolean){
    this.componenteTramite = true;
    this.componenteCategoria = false;
  }

  volver(){
    this.pagoPinVolverEvent.emit(true);
  }

}
