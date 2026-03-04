import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { UtilService } from 'src/app/services/util/util.service';

@Component({
  selector: 'app-simple-info',
  templateUrl: './simple-info.component.html',
  styleUrls: ['./simple-info.component.scss']
})
export class SimpleInfoComponent {

  constructor(
    private readonly _utils: UtilService,
    private readonly _bottomSheetRef: MatDialogRef<SimpleInfoComponent>,
    @Inject(MAT_DIALOG_DATA) public data: [string, string]
  ) {
    _bottomSheetRef.disableClose = true;
  }

  ngOnInit(): void {// Se ejecuta al inicializar el componente
  }

  openLink(event: MouseEvent): void {
    this._bottomSheetRef.close();
    this._utils.cambiarRutaInterna("/");
    event.preventDefault();
  }

}
