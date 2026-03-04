import { Component, OnInit, Inject, ViewChild, ElementRef, EventEmitter, Output, ChangeDetectorRef } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog'; // Importa MatDialogRef
import { UtilService } from 'src/app/services/util/util.service';
import { AutorizacionDaviplata } from 'src/app/interfaces/pago/PinesOlimpia/AutorizacionDaviplata';
import { RespuestaConfirmacionDaviplata } from 'src/app/interfaces/pago/Daviplata/RespuestaConfirmacionDaviplata';
import { DataService } from 'src/app/services/data/cotizador/data.service';
import { ValidacionRespuestaDaviplata } from 'src/app/interfaces/pago/Daviplata/ValidacionRespuestaDaviplata';
@Component({
  selector: 'app-confirmar-otp-daviplata',
  templateUrl: './confirmar-otp-daviplata.component.html',
  styleUrls: ['./confirmar-otp-daviplata.component.scss']
})
export class ConfirmarOtpDaviplataComponent implements OnInit {
  @ViewChild('codigoConfirmacion') codigoConfirmacionRef?: ElementRef<HTMLInputElement>;
  tiempoRestante: number = 180;
  numeroAutorizacion: number = 0;
  intervalo: any;
  tiempoAgotado: boolean = false;
  mostrarMensaje: boolean = false;
  respuestaError: string = '';
  intentos: number = 0;
  permitirReenvio: boolean = true;
  mostrarReenvio: boolean = false;
  deshabilitarBoton: boolean = false;
  cargandoReenvio: boolean = false;
  inputEnable: boolean = true;
  dialogIsClosed: boolean = false;
  resendOtp: boolean = false;
  closeWithResend: boolean = false;
  isOtpValid!: boolean;
  errorListResendOtp: number[] = [500, 401, 4001];

  @Output() onClosePopup: EventEmitter<ValidacionRespuestaDaviplata> = new EventEmitter<ValidacionRespuestaDaviplata>();
  constructor(

    private readonly _utils: UtilService,
    private readonly _data: DataService,
    private readonly _dialogRef: MatDialogRef<ConfirmarOtpDaviplataComponent>,
    @Inject(MAT_DIALOG_DATA) public data: AutorizacionDaviplata,
    private readonly cdr: ChangeDetectorRef
  ) {

    _dialogRef.disableClose = true;

    this.data = data; 
  }

  ngOnInit(): void {
    this.iniciarContador();
    this.isOtpValid = true;
  }
  ngOnDestroy(): void {
    this.cargandoReenvio = false;
    this.mostrarReenvio = true;
    this.tiempoRestante = 0;

    if(this.intervalo){
      clearInterval(this.intervalo);
    }
  }

  iniciarContador(): void {
    this.tiempoRestante = 180;
    clearInterval(this.intervalo);
    this.intervalo = setInterval(() => {
      if (this.tiempoRestante > 0) {
        this.tiempoRestante--;
        if (this.tiempoRestante === 0) {
          clearInterval(this.intervalo);
          this.tiempoAgotado = true;
          this._utils.abrirAlerta('El tiempo para ingresar el código se ha agotado. Por favor, vuelva a intentarlo seleccionando reenviar código.');
          this.mostrarReenvio = true;
          this.mostrarMensaje = false
          this.cdr.detectChanges();
        }
      }
    }, 1000);
  }

  mostrarTiempoRestante(): string {
    this.isOtpValid ? this.inputEnable = true : this.inputEnable = false;

    const minutos: number = Math.floor(this.tiempoRestante / 60);
    const segundos: number = this.tiempoRestante % 60;

    if(`${minutos}:${segundos < 10 ? '0' : ''}${segundos}` == '0:00' || this.cargandoReenvio ){
      this.inputEnable = false;
      this.codigoConfirmacionRef!.nativeElement.value = '';
    }

    return `${minutos}:${segundos < 10 ? '0' : ''}${segundos}`;
  }

  closeDialog(): void {
    this._dialogRef.close();

    this.dialogIsClosed = true;
    this.closeWithResend = this.dialogIsClosed == true && this.resendOtp == true;
  }

  infoAutorizacionDaviplata() {
      const fechaActual = new Date();
      const fecha = new Date(fechaActual.valueOf() - fechaActual.getTimezoneOffset() * 60000);

      let info: AutorizacionDaviplata = {
        idCliente: this.data.idCliente,
        fechaTransaccion: fecha.toISOString(),
        idConvenio: this.data.idConvenio,
        idRunt: String(this.data.idRunt),
        numeroAutorizacion: Number(this.codigoConfirmacionRef?.nativeElement.value),
        numeroIdentificacion: this.data.numeroIdentificacion,
        numeroPin: this.data.numeroPin,
        tipoIdentificacion: this.data.tipoIdentificacion,
        valorTransaccion: Math.round(Number(this.data.valorTransaccion)),
      }

      this._data.AutorizarPagoDaviplata(info).subscribe((x: RespuestaConfirmacionDaviplata) => {

        if (x.codigoRespuesta == 0) {x

          this._dialogRef.close();
          this.onClosePopup.emit({ success: true, respuesta: x });
        } else if (x.codigoRespuesta == -1 || x.codigoRespuesta == 5) {
          this._dialogRef.close();
          this.onClosePopup.emit({ success: true, respuesta: x });
        }else if(this.errorListResendOtp.includes(x.codigoRespuesta)){

          this.respuestaError = this.obtenerMensajeError(x.codigoRespuesta);
          this.mostrarMensaje = true
          this.isOtpValid = false;
          this.isOtpValid ? this.inputEnable = true : this.inputEnable = false;
          this.cdr.detectChanges();
          this.mostrarReenvio = true;
        } else {
          this._dialogRef.close();
          this.onClosePopup.emit({ success: true, respuesta: x });
        }
      })
  }

  actualizarData(autorizacionDaviplata: AutorizacionDaviplata) {
    this.data = autorizacionDaviplata;
    this.iniciarContador();
    this.mostrarMensaje = false
    this.cdr.detectChanges();

  }

  obtenerMensajeError(codigoRespuesta: number): string {
    switch (codigoRespuesta) {
      
      case 500:
        return 'El campo OTP se encuentra vacío';
      case 401:
        return 'El OTP no es válido';
      default:
        return 'Error inesperado';
    }

  }

  reenviarCodigo() {
    this.cargandoReenvio = true;
    this.mostrarReenvio = false;
    this.resendOtp = true;
    this.isOtpValid = true;

    let x = {
      codigoRespuesta: -2,
      mensajeRespuesta: "Reenviar codigo usuario.",
      numeroAuditoria: '',
    }
    this.onClosePopup.emit({ success: false, respuesta: x });

    this.codigoConfirmacionRef!.nativeElement.value = '';
    setTimeout(() => {
      this.cargandoReenvio = false;
    }, 3000)
  }

  validarSoloNumeros(event: KeyboardEvent): void {
    const inputChar = event.key;
    if (!/^\d+$/.test(inputChar)) {
      event.preventDefault();
    }
  }

}
