import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { UtilService } from 'src/app/services/util/util.service';
import { DataService } from 'src/app/services/data/cotizador/data.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PagoPin } from 'src/app/interfaces/compraPin/PagoPin';
import { CamposValidacion } from '../camposValidacion';
import { MensajesValidacion } from '../mensajesValidacion';
import { MatDialog } from '@angular/material/dialog';;
import { ExpresionesRegulares } from 'src/app/enums/ExpresionesRegulares';
import { TipoDocumentoPtesaClass } from 'src/app/class/cotizador/tipoDocumentoPtesaClass';
import { TipoDocumentoPtesaDTO } from 'src/app/interfaces/cotizacion/TipoDocumentoPtesaDTO';
import { PermiteFacturaElectronicaRequest } from 'src/app/interfaces/pago/FacturacionElectronica/PermiteFacturaElectronicaRequest';

@Component({
  selector: 'app-datos-personales',
  templateUrl: './datos-personales.component.html',
  styleUrls: ['./datos-personales.component.scss']
})
export class DatosPersonalesComponent implements OnInit {
  readonly:boolean=false;
  compraPinForm!: FormGroup;
  camposValidacion: any = CamposValidacion;
  mensajesValidacion: any = MensajesValidacion;
  mayoriaDeEdad: number = 18;
  validacionManual:boolean = false;
  terminosCtrol: boolean = false;
  expresionesRegulares: any = ExpresionesRegulares;
  _tipoDocumentoPtesaClass!: TipoDocumentoPtesaClass;
  seleccion: number = 0;
  nombreDocumento: string = "";
  numeroRunt!: PermiteFacturaElectronicaRequest;
  tieneFacturaElectronica: boolean = false;
  habilitaFacturaElectronica: boolean = false;
  idTriggerFE: string = '';
  successRequestParam!: boolean;

  @Input() pagoPin!: PagoPin;
  @Output() pagoPinEvent = new EventEmitter<PagoPin>();
  @Output() pagoPinVolverEvent = new EventEmitter<boolean>();
  @Output() aplicaFacturaElectronicaEvent = new EventEmitter<boolean>();
  constructor(
    private readonly _utils: UtilService,
    private readonly _data: DataService,
    private readonly _formBuilder: FormBuilder,
    private readonly _bottomSheet: MatDialog,
    ) {
   }

  ngOnInit(): void {
    this._tipoDocumentoPtesaClass = new TipoDocumentoPtesaClass(this._data);
    this.inicializarFormulario();
    this.obtenerTiposIdentificacion();
    this.administrarCambiosDatosBasicos();
    this.reasignarSeleccin();
    //this.onFacturaElectronica();
    this.facturacionElectronicaInit();
  }

  private inicializarFormulario() {
    this.compraPinForm = this._formBuilder.group({
      email: ["", [Validators.required, Validators.pattern(this.expresionesRegulares.email)]],
      celular: ["", [Validators.required, Validators.minLength(10), Validators.pattern(/^3\d{9}$/)]],
      nombres: ['', [Validators.required, Validators.pattern('^[a-zA-ZáéíóúÁÉÍÓÚñÑ\\s]+$')]],
      apellidos: ['', [Validators.required, Validators.pattern('^[a-zA-ZáéíóúÁÉÍÓÚñÑ\\s]+$')]],
      tipoDocumento: ["1", [Validators.required]],
      documento: ["", [Validators.required, Validators.pattern('^[0-9^]*$')]],
      tieneFacturaElectronica: [this.pagoPin.checkFacturaElectronica],      
    });

    this.compraPinForm.valueChanges.subscribe(() =>{
      this._utils.validarErroresFormulario(this.compraPinForm, this.camposValidacion, this.mensajesValidacion);
    });

    this.compraPinForm.get("tipoDocumento")?.valueChanges.subscribe(()=>{
      this._utils.validarNumeroDocumento(this.compraPinForm, "tipoDocumento", "documento", this.camposValidacion, this.mensajesValidacion, this.pagoPin.clienteCompra);
    });
  }

  administrarCambiosDatosBasicos() {
    this.compraPinForm.statusChanges.subscribe(newStaus => {
      setTimeout(() => {
        this.validacionManual = (newStaus === "VALID");
      })
    });

    this.readonly = !!this.pagoPin.validarlogueado;
    this.compraPinForm.patchValue({
      email: (this.pagoPin.usuario.correo ?? ""),
      celular: (this.pagoPin.usuario.celular ?? ""),
      nombres: (this.pagoPin.usuario.nombre ?? ""),
      apellidos: (this.pagoPin.usuario.apellido ?? ""),
      tipoDocumento: (String(this.pagoPin.usuario.tipoDocumento) ?? ""),
      documento: (this.pagoPin.usuario.numDocumento ?? ""),
    });
  }

  /**
  * Obtiene los tipos de identificacion
  *  y filtra de acuerdo a la edad
  */
  private obtenerTiposIdentificacion(): void {
    this._tipoDocumentoPtesaClass.get().subscribe((s: TipoDocumentoPtesaDTO[]) =>{
      this._tipoDocumentoPtesaClass.set(s);
      this.pagoPin.tiposDeDocumento = this._tipoDocumentoPtesaClass.getDocumentosByClienteCompraEdad(
        this.pagoPin.clienteCompra, this.pagoPin.edadAspirante
      );

      const currentDocType = this.compraPinForm.get("tipoDocumento")!.value;
      const docTypeExists = this.pagoPin.tiposDeDocumento?.some(
        doc => String(doc.idTipoSisec) === String(currentDocType)
      );
      
      if(!docTypeExists){
        this.compraPinForm.get("tipoDocumento")!.setValue(null, { emitEvent: false });
        this.validacionManual = false;
      }
    });
  }

  /**
  * Recupera sigla de acuerdo al tipo de documento seleccionado, para ser enviado a ACH
  * @param typeDocumentId Tipo de documento seleccionado
  */
   obtenerCodigoACHdelTipoDocumento(typeDocumentId: number) {

    const documentoID = typeDocumentId.toString();

    const typeSelected = this.pagoPin.tiposDeDocumento?.find(
      (x) => x.idTipoSisec == documentoID
    );
    return typeSelected?.codigoACH;
  }

  avanzarPagoCuotas()
  {
    let estadoFlujo: boolean = false;
    if(this.compraPinForm.valid){
      estadoFlujo = true;
    }

    if(estadoFlujo)
    {
      this.pagoPin.usuario.correo = this.compraPinForm.get("email")!.value;
      this.pagoPin.usuario.celular = this.compraPinForm.get("celular")!.value;
      this.pagoPin.usuario.nombre = this.compraPinForm.get("nombres")!.value;
      this.pagoPin.usuario.apellido = this.compraPinForm.get("apellidos")!.value;
      this.pagoPin.usuario.tipoDocumento = this.compraPinForm.get("tipoDocumento")!.value;
      this.pagoPin.usuario.numDocumento = String(this.compraPinForm.get("documento")!.value).toUpperCase();
      this.pagoPin.usuario.tipoDocumentoDescpcion = this.obtenerCodigoACHdelTipoDocumento(Number(this.pagoPin.usuario.tipoDocumento));
      this.pagoPinEvent.emit(this.pagoPin);
    }
  }

  volver(){
    this.pagoPin.registroMiPerfil = 0;
    this.pagoPinVolverEvent.emit(true);
  }
   facturacionElectronicaInit(){      
      this.numeroRunt = {idRunt:  this.pagoPin.centroSeleccionado?.codigoRUNT ?? 0}   
      this._data.PermiteFacturaElectronica(this.numeroRunt).subscribe((respuesta)=>{
         if(respuesta.datos!=undefined && respuesta?.datos?.facturacionHabilitada){
          this.idTriggerFE = respuesta?.datos?.codigoDisparador;
          this.habilitaFacturaElectronica = respuesta?.datos?.facturacionHabilitada ?? false;
          this.successRequestParam = respuesta.datos.facturacionHabilitada;
          
          this.aplicaFacturaElectronicaEvent.emit(this.successRequestParam);

          if(!this.habilitaFacturaElectronica){
            this.compraPinForm.patchValue({
              tieneFacturaElectronica: false
            });
            this.pagoPin.checkFacturaElectronica = false;
            this.pagoPin.checkFacturaElectronicaResumen = false;
          }
        } else {
          this.aplicaFacturaElectronicaEvent.emit(false);
        }
        
      });
    }

  cambiarAVista(vista: number) {
    // Cambia la vista del componente
  }

  reasignarSeleccin(){
    if (this.pagoPin.usuario.tipoDocumento) {
      this.compraPinForm.patchValue({
        tipoDocumento: this.pagoPin.usuario.tipoDocumento,
      });

      this.seleccion = this.pagoPin.usuario.tipoDocumento
      this.nombreDocumento = this.obtenerNombreTipoDocumento(this.pagoPin.usuario.tipoDocumento.toString());
    }
  }

  obtenerNombreTipoDocumento(idTipoDocumento: string): string {
    const tipoDocumento = this.pagoPin.tiposDeDocumento?.find(
      tipo => tipo.idTipoSisec === idTipoDocumento
    );

    return tipoDocumento?.nombre ?? '';
  }
 
   onFacturaElectronicaChanges(): void {
    if(this.habilitaFacturaElectronica){
      const value = this.compraPinForm.get('tieneFacturaElectronica')?.value;
    this.pagoPin.checkFacturaElectronica = value;
    if(value==false){this.pagoPin.checkFacturaElectronicaResumen = false}
    }else{
      this.pagoPin.checkFacturaElectronica = false;
      this.pagoPin.checkFacturaElectronicaResumen = false;
    }
    
    
  }

}
