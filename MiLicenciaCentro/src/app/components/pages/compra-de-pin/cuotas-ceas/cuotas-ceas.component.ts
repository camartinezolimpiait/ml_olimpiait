import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PagoPin } from 'src/app/interfaces/compraPin/PagoPin';
import { TipoPago } from 'src/app/enums/PinesOlimpia/TipoPago';
import { DataService } from 'src/app/services/data/cotizador/data.service';
@Component({
  selector: 'app-cuotas-ceas',
  templateUrl: './cuotas-ceas.component.html',
  styleUrls: ['./cuotas-ceas.component.scss']
})
export class CuotasCeasComponent implements OnInit {
  compraPinForm!: FormGroup;
  validacionManual:boolean = false;
  tipoRecaudo: any = TipoPago
  @Input() pagoPin!: PagoPin;
  @Output() pagoPinEvent = new EventEmitter<PagoPin>();
  @Output() pagoPinVolverEvent = new EventEmitter<boolean>();
  constructor(
    private readonly _formBuilder: FormBuilder,  private readonly _data: DataService,
    
    ) {
   }

  ngOnInit(): void {
    this.inicializarFormulario();
    this.administrarCambiosDatosBasicos();
  }

  private inicializarFormulario() {
    this.compraPinForm = this._formBuilder.group({
      cuotas: [this.pagoPin.cuotas, [Validators.min(1), Validators.max(6)]],
    });
  }

  administrarCambiosDatosBasicos() {
    this.compraPinForm.statusChanges.subscribe(newStaus => {
      setTimeout(() => {
        this.validacionManual = (newStaus === "VALID" ? true : false)
      })
    });
    this.compraPinForm.patchValue({
      cuotas: this.pagoPin.cuotas ?? ""
    });
  }

  onContinuar()
  {
    /// Validar que el formulario sea valido y que las cuotas no sean nulas
    if (this.compraPinForm.valid && this.compraPinForm.get("cuotas")?.value != null) {
      const tipoRecaudoFormValue = this.compraPinForm.get("tipoRecaudoCtrl")?.value;
      /// Si el tipo de recaudo es diferente a efectivo, entonces se debe resetear el campo de tipo de recaudo
      if (this.pagoPin.tipoRecaudoCtrl && (tipoRecaudoFormValue != this.tipoRecaudo.Efectivo || tipoRecaudoFormValue == undefined)) {
        this.compraPinForm.get("tipoRecaudoCtrl")?.reset();
        this.pagoPin.tipoRecaudoCtrl = 0;
      }

      this.pagoPin.cuotas = this.compraPinForm.get("cuotas")?.value;
      
      const numeroRunt = { idRunt: this.pagoPin.centroSeleccionado?.codigoRUNT ?? 0 };
      this._data.PermiteFacturaElectronica(numeroRunt).subscribe((response) => {
        if (response?.datos && response.datos.facturacionHabilitada) {
          this._data.setEnableConfirmFE(true);
        } else {
          this._data.setEnableConfirmFE(false);
        }
        this.pagoPinEvent.emit(this.pagoPin);
      });
    }
  }

  onVolver()
  {
    const numeroRunt = { idRunt: this.pagoPin.centroSeleccionado?.codigoRUNT ?? 0 };
  this._data.PermiteFacturaElectronica(numeroRunt).subscribe((response) => {
    if (response?.datos && response.datos.facturacionHabilitada) {
      this._data.setEnableConfirmFE(true);
    } else {
      this._data.setEnableConfirmFE(false);
    }
    this.pagoPinVolverEvent.emit(true);
  });
  }

  cambiarAVista(vista: number){
      //Cambio de vista
  }
}
