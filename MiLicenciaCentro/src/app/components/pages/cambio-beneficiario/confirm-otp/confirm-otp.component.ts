import { Component, Inject } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA }from "@angular/material/dialog";

export interface BottomData {
  otp: number;
}

@Component({
  selector: "app-confirm-otp",
  templateUrl: "./confirm-otp.component.html"
})
export class ConfirmOTPComponent {
  constructor(
    private readonly _bottomSheetRef: MatDialogRef<ConfirmOTPComponent>,
    @Inject(MAT_DIALOG_DATA) public data: BottomData
  ) {
    _bottomSheetRef.disableClose = true;
  }

  openLink(event: MouseEvent): void {
    this._bottomSheetRef.close();
    event.preventDefault();
  }
}
