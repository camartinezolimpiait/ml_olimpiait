import { Component, OnInit, Inject } from '@angular/core';
import {
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';

@Component({
  selector: 'app-dialogo-simple',
  templateUrl: './dialogo-simple.component.html',
  styleUrls: ['./dialogo-simple.component.scss'],
})
export class DialogoSimpleComponent implements OnInit {

confirm:boolean = false;
idBoton:string = "";

  constructor(
    public dialogRef: MatDialogRef<DialogoSimpleComponent>,
    @Inject(MAT_DIALOG_DATA) public data: [string, string, boolean, string],
  ) {}
  onClick(): void {
    this.dialogRef.close();
  }

  ngOnInit(): void {
    this.confirm = (this.data[2] === undefined ? false : true);
    this.idBoton = (this.data[3] === undefined ? "confirmar" : this.data[3])
  }

  onClickOk(): void {
    this.dialogRef.close('ok');
  }
}
