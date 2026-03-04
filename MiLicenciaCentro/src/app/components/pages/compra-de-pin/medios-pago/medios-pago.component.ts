import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { PagoPin } from 'src/app/interfaces/compraPin/PagoPin';
import { MedioPago, MediosPago, TipoPago } from 'src/app/enums/PinesOlimpia/TipoPago';
import { TipoPersona } from 'src/app/enums/PinesOlimpia/TipoPersona';
import { TipoCliente } from 'src/app/enums/PinesOlimpia/TipoCliente';
import { TipoDocumentoPtesaDTO } from 'src/app/interfaces/cotizacion/TipoDocumentoPtesaDTO';
import { DocumentosDaviplata } from 'src/app/enums/PinesOlimpia/DocumentosDaviplata';
import { CamposValidacion } from '../camposValidacion';
import { MensajesValidacion } from '../mensajesValidacion';
import { ExpresionesRegulares } from 'src/app/enums/ExpresionesRegulares';
import { TipoDocumento } from 'src/app/enums/TipoDocumento';
import { UtilService } from 'src/app/services/util/util.service';
import { TipoDocumentoPtesaClass } from 'src/app/class/cotizador/tipoDocumentoPtesaClass';
import { DataService } from 'src/app/services/data/cotizador/data.service';
import { PasosCotizacion } from 'src/app/enums/forms/Cotizador';

@Component({
  selector: 'app-medios-pago',
  templateUrl: './medios-pago.component.html',
  styleUrls: ['./medios-pago.component.scss']
})
export class MediosPagoComponent implements OnInit {
  compraPinForm!: FormGroup;
  tipoRecaudo: any = TipoPago
  mediosPago: MedioPago[] = MediosPago
  tipoPersona: any = TipoPersona;
  _regexDocumento: string = '^[0-9]+$';
  _regexDocumentoPassport: string = '^[0-9a-zA-Z]+$';
  _regexNombre: string = '^[a-zA-Z ]+$';
  _regexCelular = /^3\d{9}$/;
  _validacionkey: number = 0;
  _validacionGeneral: boolean = false;
  expresionesRegulares: any = ExpresionesRegulares;
  estadoFlujo:boolean=false;
  camposValidacion: any = CamposValidacion;
  mensajesValidacion: any = MensajesValidacion;
  validacionManual: boolean = false;
  daviplataCheckbox: boolean = false;
  tiposDeDocumentoDaviplata: TipoDocumentoPtesaDTO[] = [];
  _tipoDocumentoPtesaClass!: TipoDocumentoPtesaClass;
  tiposDocumentoAceptadoDaviplata: any = DocumentosDaviplata;
  disablecheckboxDaviplata: boolean = false;

  @Input() pagoPin!: PagoPin;
  @Output() pagoPinEvent = new EventEmitter<PagoPin>();
  @Output() pagoPinVolverEvent = new EventEmitter<boolean>();
  @Output() personalDataRedirectEvent = new EventEmitter<number>();
  @Output() volverCentroEvent = new EventEmitter<boolean>();
  constructor(
    private readonly _formBuilder: FormBuilder,
    private readonly _utils: UtilService,
    private readonly _data: DataService
    ) {
   }

  ngOnInit(): void {
    this.inicializarFormulario();
    this._tipoDocumentoPtesaClass = new TipoDocumentoPtesaClass(this._data);
    this.obtenerTiposIdentificacion();


    if (this.pagoPin.tipoRecaudoCtrl != null) {
      switch (this.pagoPin.tipoRecaudoCtrl) {

        case TipoPago.Daviplata:
          this.SetearDatosPrecargaDaviplata();
          break;
        default:
          break;
      }
    }
  }

  private inicializarFormulario() {
    if(this.pagoPin.mediosPago.length == 0)
    {

      this._utils.abrirAlerta('El centro no tiene convenios asociados. Seleccione otro centro.');
      
      setTimeout(() => {
        this.volverCentroEvent.emit(true);
      }, 3000);
      
    }

    if (this.pagoPin.clienteCompra == TipoCliente.CEA) {

        if (this.pagoPin.cuotas != null && this.pagoPin.cuotas > 1 && this.pagoPin.mediosPagoTodos.length > 0) {
          // Validacion de cuando el pago es a cuotas y filtramos los medios de pago.
          this.pagoPin.mediosPago = this.pagoPin.mediosPagoTodos?.filter(x => x.id != 2 && x.id != 13 && x.id != 16);
          } else {
            this.pagoPin.mediosPago = this.pagoPin.mediosPagoTodos
          }
        
        
    }

    this.compraPinForm = this._formBuilder.group({
      tipoRecaudoCtrl: [null],
      tipoPersonaPSE: [null],
      tipoBancoPSE: [null],
      tipoPagoEfectivo: [null],
      checkDaviplata: [null],
      tipoDocumento: [null],
      documento: [null],
    });
    this.compraPinForm.patchValue({
      tipoRecaudoCtrl: this.pagoPin.tipoRecaudoCtrl,
      tipoPersonaPSE: this.pagoPin.tipoPersonaPSE,
      tipoBancoPSE: this.pagoPin.tipoBancoPSE,
      tipoPagoEfectivo: this.pagoPin.tipoPagoEfectivo,
      checkDaviplata: [null],
      tipoDocumento: [null],
      documento: [null]
    });

    this.checkButtonStatus();

    this.compraPinForm.valueChanges.subscribe((values) => {
      this.checkButtonStatus();
    });
  }

  private checkButtonStatus(): void {
  const form = this.compraPinForm;
  const tipoRecaudo = form.get('tipoRecaudoCtrl')?.value;

  this.estadoFlujo = false;

  switch (tipoRecaudo) {
    case this.tipoRecaudo.Efectivo:
      if (form.get('tipoPagoEfectivo')?.value) {
        this.estadoFlujo = true;
      }
      break;

    case this.tipoRecaudo.PSE:
      if (form.get('tipoPersonaPSE')?.value && form.get('tipoBancoPSE')?.value) {
        this.estadoFlujo = true;
      }
      break;

    case this.tipoRecaudo.BancolombiaWompi:
      this.estadoFlujo = true;
      break;

    case this.tipoRecaudo.Daviplata:
      if (form.get('checkDaviplata')!.value == true) {
        this.estadoFlujo =
          form.get('tipoDocumento')!.value != null &&
          form.get('tipoDocumento')!.value != '' &&
          form.get('documento')!.value != null &&
          form.get('documento')!.value != '';
      } else {
        this.estadoFlujo = true;
      }
      break;

    default:
      this.estadoFlujo = false;
      break;
  }
}

  volverPagoCuotas()
  {
    const numeroRunt = { idRunt: this.pagoPin.centroSeleccionado?.codigoRUNT ?? 0 }; 
    this._data.PermiteFacturaElectronica(numeroRunt).subscribe((response) => {
      
    if (response?.datos && response.datos.facturacionHabilitada) {
      // Si aplica FE
      this.pagoPinVolverEvent.emit(true);
      this._data.setEnableConfirmFE(true);
    } else {
      // NO aplica
      this._utils.abrirAlerta('En este momento, este centro no cuenta con facturación electrónica, serás redirigido a Datos personales');
      this.personalDataRedirectEvent.emit(PasosCotizacion.DatosPersonales);
      this._data.setEnableConfirmFE(false);
    }
  });

  }


  continuarConResumen(){
    if(this.compraPinForm.get("tipoRecaudoCtrl")!.value == this.tipoRecaudo.Efectivo && this.compraPinForm.get("tipoPagoEfectivo")!.value != null)
    {
      this.pagoPin.tipoRecaudoCtrl = this.compraPinForm.get("tipoRecaudoCtrl")!.value;
      this.pagoPin.tipoPagoEfectivo = this.compraPinForm.get("tipoPagoEfectivo")!.value;
      this.pagoPin.tipoBancoPSE = null;
      this.pagoPin.tipoPersonaPSE = null;
      this.estadoFlujo=true;
      this.pagoPinEvent.emit(this.pagoPin);
    }
    else if(this.compraPinForm.get("tipoRecaudoCtrl")!.value == this.tipoRecaudo.PSE
      && this.compraPinForm.get("tipoPersonaPSE")!.value != null
      && this.compraPinForm.get("tipoBancoPSE")!.value != null)
    {
      this.pagoPin.tipoRecaudoCtrl = this.compraPinForm.get("tipoRecaudoCtrl")!.value;
      this.pagoPin.tipoBancoPSE = this.compraPinForm.get("tipoBancoPSE")!.value;
      this.pagoPin.tipoPersonaPSE = this.compraPinForm.get("tipoPersonaPSE")!.value;
      this.pagoPin.tipoPagoEfectivo = null;
      this.pagoPinEvent.emit(this.pagoPin);
      this.estadoFlujo=true;
    }
    else if(this.compraPinForm.get('tipoRecaudoCtrl')!.value == this.tipoRecaudo.BancolombiaWompi){
      this.pagoPin.tipoRecaudoCtrl = this.compraPinForm.get('tipoRecaudoCtrl')!.value;
      this.pagoPin.tipoBancoPSE = null;
      this.pagoPin.tipoPersonaPSE = null;
      this.pagoPin.tipoPagoEfectivo = null;
      this.estadoFlujo=true;
      this.pagoPinEvent.emit(this.pagoPin);
    }
    else if (
      this.compraPinForm.get('tipoRecaudoCtrl')!.value ==
      this.tipoRecaudo.Daviplata
    ) {
      if (this.compraPinForm.get('checkDaviplata')!.value == true) {
        if (
          this.compraPinForm.get('tipoDocumento')!.value != null &&
          this.compraPinForm.get('tipoDocumento')!.value != '' &&
          this.compraPinForm.get('documento')!.value != null &&
          this.compraPinForm.get('documento')!.value != ''
        ) {
          this.pagoPin.tipoRecaudoCtrl = this.compraPinForm.get('tipoRecaudoCtrl')!.value;
          this.pagoPin.tipoBancoPSE = null;
          this.pagoPin.tipoPersonaPSE = null;
          this.pagoPin.tipoPagoEfectivo = null;
          this.pagoPin.comprador.tipoDocumento = this.compraPinForm.get('tipoDocumento')!.value;
          this.pagoPin.comprador.numDocumento = this.compraPinForm.get('documento')!.value;
          this.pagoPin.checkDaviplata = true;
          this.pagoPinEvent.emit(this.pagoPin);
        } else {
          this.estadoFlujo = false;
        }
      } else {
        if (
          this.pagoPin.usuario.tipoDocumento != TipoDocumento.Pasaporte &&
          this.pagoPin.usuario.tipoDocumento !=
            TipoDocumento.PermisoProteccionTemporal
        ) {
          this.pagoPin.tipoRecaudoCtrl =
            this.compraPinForm.get('tipoRecaudoCtrl')!.value;
          this.pagoPin.tipoBancoPSE = null;
          this.pagoPin.tipoPersonaPSE = null;
          this.pagoPin.tipoPagoEfectivo = null;
          this.pagoPin.comprador.tipoDocumento =this.pagoPin.usuario.tipoDocumento;
          this.pagoPin.comprador.numDocumento =this.pagoPin.usuario.numDocumento;
          this.pagoPin.checkDaviplata = false;
          this.pagoPinEvent.emit(this.pagoPin);
        } else {

          this.estadoFlujo = false;
          this.estadoFlujo = false;
          this._utils.abrirAlerta(
            'Tu tipo de documento no es válido para pagos con DaviPlata. Para pagar con este medio, debes hacerlo con la cuenta de Daviplata de otra persona.'
          );
        }
      }
    }
  }

  cambiarAVista(vista: number) {
      // Cambia la vista del componente
  }

  FiltrarDocumentosDaviplata() {
    let tiposauxiliaresdocumento=this.tiposDeDocumentoDaviplata;
    this.tiposDeDocumentoDaviplata = tiposauxiliaresdocumento.filter(
      (x) => Number(x.idTipoSisec) in this.tiposDocumentoAceptadoDaviplata
    );
  }
  SetearDatosPrecargaDaviplata() {
    if (this.pagoPin.checkDaviplata) {

      this.daviplataCheckbox = true;
      this._validacionkey=this.pagoPin.comprador.tipoDocumento!;
      this.compraPinForm.patchValue({
        checkDaviplata: this.pagoPin.checkDaviplata,
        tipoDocumento: this.pagoPin.comprador.tipoDocumento,
        documento: this.pagoPin.comprador.numDocumento,
      });
    }
  }
  UpdateDocument() {
    if (this._validacionkey > 0) {
      if (
        this.compraPinForm.get('documento')!.value.length > 5 &&
        this.compraPinForm.get('documento')!.value.length < 16
      ) {
        let actualizar = this.keyValidationOnly(
          String(this.compraPinForm.get('documento')!.value).toUpperCase()
        );
        if (actualizar) {
          this.camposValidacion.documento = '';
          this.pagoPin.comprador.numDocumento = String(
            this.compraPinForm.get('documento')!.value
          ).toUpperCase();

        } else {
          switch (this._validacionkey) {
            case TipoDocumento.CedulaCiudadania:
              this.camposValidacion.documento =
                'El documento acepta solamente numeros sin espacios.';
                this.estadoFlujo=false;
              break;
            case TipoDocumento.CedulaExtranjeria:
              this.camposValidacion.documento =
                'El documento acepta solamente numeros sin espacios.';
                this.estadoFlujo=false;
              break;
            case TipoDocumento.Pasaporte:
              this.camposValidacion.documento =
                'El documento acepta solamente numeros y letras sin espacios.';
                this.estadoFlujo=false;
              break;
            case TipoDocumento.TarjetaIdentidad:
              this.camposValidacion.documento =
                'El documento acepta solamente numeros y letras sin espacios.';
                this.estadoFlujo=false;
              break;
            case TipoDocumento.PermisoProteccionTemporal:
              this.camposValidacion.documento =
                'El documento acepta solamente numeros sin espacios.';
                this.estadoFlujo=false;
              break;
          }
        }
      } else {
        this.camposValidacion.documento =
          'El documento debe tener mínimo 6 \n' +
          ' caracteres máximo 15 caracteres.';
      }
    } else {
      this.camposValidacion.tipoDocumento =
        'Debe seleccionar un tipo documento.';
    }
  }
  UpdateDocumentType() {
    this._validacionkey = Number(
      this.compraPinForm.get('tipoDocumento')!.value
    );
    this.camposValidacion.tipoDocumento = '';
    this.pagoPin.comprador.tipoDocumento =
      this.compraPinForm.get('tipoDocumento')!.value;
    this.UpdateDocument();
  }

  onKeyDown(event: KeyboardEvent): void {
    // Permite solo n�meros, teclas de control y navegaci�n
    if (
      [46, 8, 9, 27, 13].indexOf(event.keyCode) !== -1 || // Permitir: Delete, Backspace, Tab, Escape, Enter
      (event.keyCode === 65 && event.ctrlKey === true) || // Ctrl+A
      (event.keyCode === 67 && event.ctrlKey === true) || // Ctrl+C
      (event.keyCode === 86 && event.ctrlKey === true) || // Ctrl+V
      (event.keyCode === 88 && event.ctrlKey === true) || // Ctrl+X
      (event.keyCode >= 35 && event.keyCode <= 39) // Home, End, Left, Right
    ) {
      return;
    }
    // Aseg�rate de que sea un n�mero y det�n el keypress
    if ((event.shiftKey || (event.keyCode < 48 || event.keyCode > 57)) && (event.keyCode < 96 || event.keyCode > 105)) {
      event.preventDefault();
    }
  }
  onInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    input.value = input.value.replace(/[^0-9]/g, '');
    this.pagoPin.comprador.numDocumento = input.value;
  }
  keyValidationOnly(event: string): boolean {
    let result = false;
    switch (this._validacionkey) {
      case TipoDocumento.CedulaCiudadania:
        //Cedula de ciudadania
        let patt0 = /^[0-9]+$/;
        result = patt0.test(event);

        break;
      case TipoDocumento.CedulaExtranjeria:
        //Cedula de ciudadania
        let patt1 = /^[0-9]+$/;
        result = patt1.test(event);

        break;
      case TipoDocumento.Pasaporte:
        //Cedula de ciudadania
        let pattr2 = /^[0-9a-zA-Z]+$/;
        result = pattr2.test(event);

        break;
      case TipoDocumento.TarjetaIdentidad:
        //Cedula de ciudadania
        let patt3 = /^[0-9]+$/;
        result = patt3.test(event);

        break;
      case TipoDocumento.PermisoProteccionTemporal:
        //Cedula de ciudadania
        let patt4 = /^[0-9]+$/;
        result = patt4.test(event);
        break;
    }
    return result;
  }
  /**
  * Obtiene los tipos de identificacion
  *  y filtra de acuerdo a la edad
  */
  private obtenerTiposIdentificacion(): void {
    this._tipoDocumentoPtesaClass.get().subscribe((s: TipoDocumentoPtesaDTO[]) =>{
      if(s){
        this.tiposDeDocumentoDaviplata = s;
        this.FiltrarDocumentosDaviplata();
      }
    });
  }
}
