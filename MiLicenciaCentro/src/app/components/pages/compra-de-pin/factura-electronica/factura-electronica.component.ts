import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { UtilService } from 'src/app/services/util/util.service';
import { DataService } from 'src/app/services/data/cotizador/data.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PagoPin } from 'src/app/interfaces/compraPin/PagoPin';

import { MatDialog } from '@angular/material/dialog';;
import { ExpresionesRegulares } from 'src/app/enums/ExpresionesRegulares';
import { TipoDocumentoPtesaClass } from 'src/app/class/cotizador/tipoDocumentoPtesaClass';
import { TipoDocumentoPtesaDTO } from 'src/app/interfaces/cotizacion/TipoDocumentoPtesaDTO';
import { CamposValidacionFE } from './camposValidacionFE';
import { MensajesValidacionFE } from './MensajesValidacionFE';
import { TipoPersona } from 'src/app/enums/PinesOlimpia/TipoPersona';
import { PermiteFacturaElectronicaRequest } from 'src/app/interfaces/pago/FacturacionElectronica/PermiteFacturaElectronicaRequest';
import { tipoDocumento } from 'src/app/interfaces/pago/FacturacionElectronica/TipoDocumentoResponse';
import { TipoCliente } from 'src/app/enums/PinesOlimpia/TipoCliente';
import { TipoPersonaFE } from 'src/app/enums/PinesOlimpia/TipoPersonaFE';

@Component({
  selector: 'app-factura-electronica',
  templateUrl: './factura-electronica.component.html',
  styleUrls: ['./factura-electronica.component.scss']
})
export class FacturaElectronicaComponent implements OnInit {
  readonly:boolean=false;
  compraPinForm!: FormGroup;
  camposValidacion: any = CamposValidacionFE;
  mensajesValidacion: any = MensajesValidacionFE;
  numeroRunt!: PermiteFacturaElectronicaRequest;
  mayoriaDeEdad: number = 18;
  validacionManual:boolean = false;
  terminosCtrol: boolean = false;
  expresionesRegulares: any = ExpresionesRegulares;
  _tipoDocumentoPtesaClass!: TipoDocumentoPtesaClass;
  tipoPersona = TipoPersona;
  seleccion: number = 0;
  nombreDocumento: string = "";
  aplicaFacturaElectronica:boolean = false;
  tieneFacturaElectronica:boolean = false;
  tipoCliente: any = TipoCliente;
  tipoDocumentoList: tipoDocumento[]= [];
  tipoPersonaFE:any=TipoPersonaFE;  
  documentoTipoInvalid: boolean = false;
  
  @Input() pagoPin!: PagoPin;
  @Output() pagoPinEvent = new EventEmitter<PagoPin>();
  @Output() pagoPinVolverEvent = new EventEmitter<boolean>();
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
    this.facturacionElectronicaInit();
  }

  private inicializarFormulario() {
    this.compraPinForm = this._formBuilder.group({
      tipoPersonaFE:['', [Validators.required]],
      correoFE: ["", [Validators.required, Validators.pattern(this.expresionesRegulares.email)]],
      nombresFE:[''],      
      apellidosFE:[''],      
      tipoDocumentoFE:[""],
      documentoFE: [""],      
      razonSocial:[''],
      nombreComercial:[''],      
      nit: [""] 
    });

    this.compraPinForm.valueChanges.subscribe(() =>{
      this._utils.validarErroresFormulario(this.compraPinForm, this.camposValidacion, this.mensajesValidacion);      
    });

this.compraPinForm.get("tipoDocumentoFE")?.valueChanges.subscribe(() => {
  const tipoPersona = this.compraPinForm.get("tipoPersonaFE")?.value;

  if (tipoPersona === this.tipoPersonaFE.Natural) {
    this._utils.validarNumeroDocumento(
      this.compraPinForm,
      "tipoDocumentoFE",
      "documentoFE",
      this.camposValidacion,
      this.mensajesValidacion,
      this.pagoPin.clienteCompra
    );
  }
});


 this.compraPinForm.get('tipoPersonaFE')?.valueChanges.subscribe((tipoPersona: number) => {
    const nombresCtrl = this.compraPinForm.get('nombresFE');
    const apellidosCtrl = this.compraPinForm.get('apellidosFE');
    const documentoCtrl = this.compraPinForm.get('documentoFE');
    const tipoDocumentoTCtrl = this.compraPinForm.get('tipoDocumentoFE');
   
    const razonSocialCtrl = this.compraPinForm.get('razonSocial');
    const nombreComercialCtrl = this.compraPinForm.get('nombreComercial');
    const nitCtrl = this.compraPinForm.get('nit');

   switch (tipoPersona) {
        case this.tipoPersonaFE.Juridica:
          // Persona jurídica
          razonSocialCtrl?.setValidators([Validators.required]);
          nombreComercialCtrl?.setValidators([Validators.required]);
          nitCtrl?.setValidators([Validators.required, Validators.pattern('^[a-zA-Z0-9]+$')]);
          nombresCtrl?.clearValidators();
          apellidosCtrl?.clearValidators();
          documentoCtrl?.clearValidators();
          tipoDocumentoTCtrl?.clearValidators();
          break;

        case this.tipoPersonaFE.Natural:
          // Persona natural
          nombresCtrl?.setValidators([Validators.required, Validators.pattern('^[a-zA-ZáéíóúÁÉÍÓÚñÑ\\s]+$')]);
          apellidosCtrl?.setValidators( [Validators.required, Validators.pattern('^[a-zA-ZáéíóúÁÉÍÓÚñÑ\\s]+$')]);
          documentoCtrl?.setValidators([Validators.required, Validators.pattern('^[0-9^]*$')]);
          tipoDocumentoTCtrl?.setValidators([Validators.required]);

          razonSocialCtrl?.clearValidators();
          nombreComercialCtrl?.clearValidators();
          nitCtrl?.clearValidators();
          break;

        default:
          // Otro tipo o ninguno
          nombresCtrl?.clearValidators();
          apellidosCtrl?.clearValidators();
          documentoCtrl?.clearValidators();
          tipoDocumentoTCtrl?.clearValidators();
          razonSocialCtrl?.clearValidators();
          nombreComercialCtrl?.clearValidators();
          nitCtrl?.clearValidators();
          break;
      }

      // Se actualiza el estado de los campos para reflejar los nuevos validadores
      nombresCtrl?.updateValueAndValidity();
      apellidosCtrl?.updateValueAndValidity();
      documentoCtrl?.updateValueAndValidity();
      tipoDocumentoTCtrl?.updateValueAndValidity();
      razonSocialCtrl?.updateValueAndValidity();
      nombreComercialCtrl?.updateValueAndValidity();
      nitCtrl?.updateValueAndValidity();

    });
  }

  facturacionElectronicaInit() {
    if (this.pagoPin.checkFacturaElectronica) {
      this._data.ObtenerTipoDocumento().subscribe((respuesta) => {
        this.pagoPin.tiposDeDocumentoFE = respuesta.entidad.filter(
          (ent: tipoDocumento) => ent.visualizarFacturacionElectronica
        );
        this.tipoDocumentoList = this.pagoPin.tiposDeDocumentoFE;
      });

      this._data.ObtenerTipoPersona().subscribe((respuesta) => {
        this.pagoPin.tipoPersonaFE = respuesta.datos.sort((a, b) => b.codigo - a.codigo);
        
        const tipoPersonaActual = this.compraPinForm.get('tipoPersonaFE')?.value;
        
        if (!tipoPersonaActual) {
          this.compraPinForm.patchValue({
            tipoPersonaFE: this.tipoPersona.Natural
          });
        }
      });
    }
  }


  administrarCambiosDatosBasicos() {
      this.compraPinForm.statusChanges.subscribe(newStaus => {
        setTimeout(() => {
          this.validacionManual = (newStaus === "VALID");
        })
      });

        this.readonly = !!this.pagoPin.validarlogueado;
        
    if(this.pagoPin.checkFacturaElectronicaResumen){
      switch (this.pagoPin.compradorFE.tipoPersona) {
        case this.tipoPersonaFE.Juridica:
          this.compraPinForm.patchValue({
            correoFE: this.pagoPin.compradorFE.correo ?? "",
            tipoPersonaFE: this.pagoPin.compradorFE.tipoPersona,
            razonSocial: this.pagoPin.compradorFE.razonSocial ?? "",
            nombreComercial: this.pagoPin.compradorFE.nombreComercial ?? "",
            nit: this.pagoPin.compradorFE.nit ?? "",
          });
          break;

        case this.tipoPersonaFE.Natural:
          this.compraPinForm.patchValue({
            correoFE: this.pagoPin.compradorFE.correo ?? "",
            tipoPersonaFE: this.pagoPin.compradorFE.tipoPersona,
            nombresFE: this.pagoPin.compradorFE.nombre ?? "",
            apellidosFE: this.pagoPin.compradorFE.apellido ?? "",
            tipoDocumentoFE: this.pagoPin.compradorFE.tipoDocumento ?? "",
            documentoFE: this.pagoPin.compradorFE.numDocumento ?? "",
          });
          break;

        default:
          this.compraPinForm.patchValue({
            correoFE: "",
            tipoPersonaFE: "",
            razonSocial: "",
            nombreComercial:  "",
            nit: "",
            nombresFE: "",
            apellidosFE:"",
            tipoDocumentoFE: "",
            documentoFE: "",
          });
          break;
      }

      this.checkDocument();
    }
  }

  /**
  * Obtiene los tipos de identificacion
  *  y filtra de acuerdo a la edad
  */
  private obtenerTiposIdentificacion(): void {
    this._tipoDocumentoPtesaClass.get().subscribe((s: TipoDocumentoPtesaDTO[]) =>{
      this._tipoDocumentoPtesaClass.set(s);
      this.pagoPin.tiposDeDocumento = this._tipoDocumentoPtesaClass.getDocumentosByClienteCompraEdad(this.pagoPin.clienteCompra, this.pagoPin.edadAspirante);
    });


    this.compraPinForm.get("tipoDocumentoFE")!.reset();
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
    const numeroRunt = { idRunt: this.pagoPin.centroSeleccionado?.codigoRUNT ?? 0 };
    let estadoFlujo: boolean = false;
    if(this.compraPinForm.valid){
      estadoFlujo = true;
    }

   if (estadoFlujo) {
      const form = this.compraPinForm;
      const comprador = this.pagoPin.compradorFE;
      const tipoPersona = form.get('tipoPersonaFE')?.value;
      
      comprador.tipoPersona = tipoPersona ?? null;
      comprador.correo = form.get('correoFE')?.value ?? null;

      comprador.nombre = null;
      comprador.apellido = null;
      comprador.tipoDocumento = null;
      comprador.numDocumento = null;
      comprador.nit = null;
      comprador.razonSocial = null;
      comprador.nombreComercial = null;

      switch (tipoPersona) {
        case this.tipoPersonaFE.Juridica:
          comprador.nit = form.get('nit')?.value ?? null;
          comprador.razonSocial = form.get('razonSocial')?.value ?? null;
          comprador.nombreComercial = form.get('nombreComercial')?.value ?? null;
          break;

        case this.tipoPersonaFE.Natural:
          comprador.nombre = form.get('nombresFE')?.value ?? null;
          comprador.apellido = form.get('apellidosFE')?.value ?? null;
          comprador.tipoDocumento = form.get('tipoDocumentoFE')?.value ?? null;
          comprador.numDocumento = String(form.get('documentoFE')?.value ?? '').toUpperCase();
          break;
        }
      
      this._data.PermiteFacturaElectronica(numeroRunt).subscribe((response) => {
        if (response?.datos && response.datos.facturacionHabilitada) {
          this._data.setEnableConfirmFE(true);
        } else {
          this._data.setEnableConfirmFE(false);
        }
      });
      this.pagoPin.checkFacturaElectronicaResumen = true;
      this.pagoPinEvent.emit(this.pagoPin);
    }
  }

  volver(){
    this.pagoPin.registroMiPerfil = 0;
    this.pagoPinVolverEvent.emit(true);
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

  private checkDocument() {
  const documentoCtrl = this.compraPinForm.get('documentoFE');
  if (this.compraPinForm.get('tipoPersonaFE')?.value == this.tipoPersonaFE.Natural) {
    this.compraPinForm.get('tipoDocumentoFE')?.valueChanges.subscribe(() => {
      documentoCtrl?.updateValueAndValidity({ emitEvent: true });

      const tipo = this.compraPinForm.get('tipoDocumentoFE')?.value;
      this.documentoTipoInvalid = !!(tipo && documentoCtrl && documentoCtrl.invalid);
    });

    this.compraPinForm.get('documentoFE')?.valueChanges.subscribe(() => {
      const tipo = this.compraPinForm.get('tipoDocumentoFE')?.value;
      this.documentoTipoInvalid = !!(tipo && documentoCtrl && documentoCtrl.invalid);
    });

    this._utils.validarErroresFormulario(this.compraPinForm, this.camposValidacion, this.mensajesValidacion);
  }
}
}
