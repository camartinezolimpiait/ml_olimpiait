import { Component, EventEmitter, Output } from "@angular/core";
import { MatDialogRef } from "@angular/material/dialog";

@Component({
  selector: "app-confirm-otp",
  templateUrl: "./confirm-otp.component.html"
})
export class ConfirmOTPComponent {
  @Output() otpCapturado: EventEmitter<string> = new EventEmitter<string>();

  constructor(private readonly _bottomSheetRef: MatDialogRef<ConfirmOTPComponent>) {
    _bottomSheetRef.disableClose = true;
  }

  capturarValorYCerrar(otpValue: string): void {
    this.otpCapturado.emit(otpValue);
    this._bottomSheetRef.close();
  }
}
