import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA }from "@angular/material/dialog";
import { FormularioDevolucion } from 'src/app/interfaces/pago/PinesOlimpia/Devoluciones/FormularioDevolucion';


@Component({
  selector: 'app-confirmar-operacion',
  templateUrl: './confirmar-operacion.component.html',
  styleUrls: ['./confirmar-operacion.component.scss']
})
export class ConfirmarOperacionComponent {
  constructor(
    private readonly _bottomSheetRef: MatDialogRef<ConfirmarOperacionComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: FormularioDevolucion
  ) { }

  recuperarTipoDocumento(id: number): string {
    return this.data.tiposDocumento.find((x: any) => x.idTipoSisec == id.toString())?.nombre
  }

  confirmarUsoDeDatos(event: MouseEvent) {
    this.data.confirmaOperacion = true
    this.openLink(event)
  }

  openLink(event: MouseEvent): void {
    this._bottomSheetRef.close();
    event.preventDefault();
  }

  setUpperCase(palabra:string):string{
    return palabra.toUpperCase();
  }
}
