import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-tyc',
  templateUrl: './tyc.component.html',
  styleUrls: ['./tyc.component.scss']
})
export class TycComponent {

  constructor(
    private readonly _bottomSheetRef: MatDialogRef<TycComponent>
  ) {}

  openLink(event: MouseEvent): void {
    this._bottomSheetRef.close();
    event.preventDefault();
  }
}
