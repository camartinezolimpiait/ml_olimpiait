import { Component, Inject, OnInit } from '@angular/core'
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TipoCuentaDevolucion } from 'src/app/enums/PinesOlimpia/TipoCuentaDevolucion';
import { TipoDocumentoPtesaDTO } from 'src/app/interfaces/cotizacion/TipoDocumentoPtesaDTO';
import { BancosPinesOlimpia } from 'src/app/interfaces/pago/PinesOlimpia/BancosPinesOlimpia';
import { DataService } from 'src/app/services/data/cotizador/data.service';
import { UtilService } from 'src/app/services/util/util.service';

@Component({
  selector: 'app-actualizacion-datos-devolucion',
  templateUrl: './actualizacion-datos-devolucion.component.html',
  styleUrls: ['./actualizacion-datos-devolucion.component.scss']
})
export class ActualizacionDatosDevolucionComponent implements OnInit {
  actualizacionDevolucionForm!: FormGroup;
  isOk = false;
  bancos: any = [];
  tiposDeDocumento: TipoDocumentoPtesaDTO[] = [];
  tipoCuentaDevolucion = TipoCuentaDevolucion;
  longitudDocumento: number = 11;

  constructor(
    private readonly _formBuilder: FormBuilder,
    private readonly _bottomSheetRef: MatDialogRef<ActualizacionDatosDevolucionComponent>,
    @Inject (MAT_DIALOG_DATA) public data: any,
    private readonly _data: DataService,
    private readonly _utils: UtilService,
  ) { }

  ngOnInit() {
    if(this.data.form == null || this.data.form == undefined) {
      this.actualizacionDevolucionForm = this._formBuilder.group({
        banco: ['', Validators.required],
        tipoDeCuenta: ['', Validators.required],
        numeroDeCuenta: ['', Validators.required],
        tipoDocTitular: ['', Validators.required],
        numDocTitular: [
          '',
          [Validators.required, Validators.pattern('^[0-9^]*$')],
        ],
      });
    }
    else{
      this.actualizacionDevolucionForm = this.data.form;
    }
    
    this.tiposDeDocumento = this.data.TiposDeDocumento;
    this.bancos = this.data.Bancos;
  }

  openLink(event: MouseEvent): void {
    this._bottomSheetRef.close();
    event.preventDefault();
  }

  confirmarUsoDeDatos(event: MouseEvent) {
    if (this.actualizacionDevolucionForm.valid) {
      this.isOk = true;
      this.openLink(event)
    }
  }
}
