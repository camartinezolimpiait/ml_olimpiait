import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FechaValidador } from 'src/app/const/customValidators/ThreeInputDateValidator';
import { Sexo } from 'src/app/enums/Sexo';
import { PagoPin } from 'src/app/interfaces/compraPin/PagoPin';
import { DataService } from 'src/app/services/data/cotizador/data.service';
import moment from 'moment';
import { EMPTY } from 'rxjs';
import { catchError, debounceTime, distinctUntilChanged, flatMap } from 'rxjs/operators';
import { UtilService } from 'src/app/services/util/util.service';

@Component({
  selector: 'app-datos-basicos',
  templateUrl: './datos-basicos.component.html',
  styleUrls: ['./datos-basicos.component.scss']
})
export class DatosBasicosComponent implements OnInit {
  /**
  * Controles y formularios
  */
  compraPinForm!: FormGroup
  readonly:boolean = false;
  anioActual: number = new Date().getFullYear();
	sexos: any = Sexo;
	mayoriaDeEdad: number = 18;
  validacionManual:boolean = false;
  edadActual: number = 0;

	@Input() pagoPin!: PagoPin;
  @Output() pagoPinEvent = new EventEmitter<PagoPin>();
  constructor(
    private readonly _formBuilder: FormBuilder,
		private readonly _data: DataService,
    private readonly _utils: UtilService,
  ) {}

  ngOnInit(): void {
    this.inicializarFormulario();
		this.administrarCambiosDatosBasicos();
  }

  private inicializarFormulario()
  {
    this.compraPinForm = this._formBuilder.group({
    sexo: ["", Validators.required],
    fecha: this._formBuilder.group({
      dia: [null, [Validators.required, Validators.min(1), Validators.max(31)]],
      mes: [null, [Validators.required, Validators.min(1), Validators.max(12)]],
      anio: [null, [Validators.required, Validators.min(this.anioActual - 120), Validators.max(this.anioActual - 16)]],
      }, { validator: FechaValidador }
			)
    });
  }

	administrarCambiosDatosBasicos() {
    this.compraPinForm.valueChanges.pipe(
      debounceTime(100),
      distinctUntilChanged(),
      flatMap(x => {
          if (this.validacionManual) {
            return this._data.calcularEdadAspirante(`${x.fecha.mes}-${x.fecha.dia}-${x.fecha.anio}`).pipe(
              catchError(async () => null)
            )
          } else { return EMPTY }
        }
      )
    ).subscribe((val: any) => {
      this.edadActual = +val;

      if(this.edadActual == null || this.edadActual == 0){ return; }
      if(this.edadActual < 18 && (this.pagoPin.categoria.includes("I") || this.pagoPin.categoria1.includes("I")
        || this.pagoPin.categoria2.includes("I"))){
          this._utils.abrirAlerta("Las categorias de instructor solo son aplicables para mayores de edad.");
          return;
      }

      if (this.edadActual != this.pagoPin.edadAspirante) {
        this.pagoPin.edadAspirante = +val;
        if(this.edadActual < 18){
          this.pagoPin.categoria="";
          this.pagoPin.categoria1="";
          this.pagoPin.categoria="";
        }
      }

    });

    this.compraPinForm.statusChanges.subscribe(newStaus => {
      setTimeout(() => {
        this.validacionManual = (newStaus === "VALID" ? true : false)
      })
    });

    if(this.pagoPin.usuario.fechaNacimiento != null){
      this.readonly = this.pagoPin.validarlogueado ? true : false ;
      let fechaNa = moment(this.pagoPin.usuario.fechaNacimiento);
      this.compraPinForm.patchValue({
        sexo: this.pagoPin.usuario.genero ?? "",
        fecha: {
          dia: (fechaNa != undefined ? Number(fechaNa.date()): null),
          mes: (fechaNa != undefined ? Number(fechaNa.month() + 1): null),
          anio: (fechaNa != undefined ? Number(fechaNa.year()): null)
        }
      });
    }
  }

	continuarConTramite(){
		this.pagoPin.usuario.genero = this.compraPinForm.get("sexo")!.value;

    if(this.edadActual < 18 && (this.pagoPin.categoria.includes("I") || this.pagoPin.categoria1.includes("I")
      || this.pagoPin.categoria2.includes("I"))){
        this._utils.abrirAlerta("Las categorias de instructor solo son aplicables para mayores de edad.");
        return;
    }

    this.pagoPin.usuario.fechaNacimiento = moment([
      this.compraPinForm.value.fecha.anio,
      this.compraPinForm.value.fecha.mes - 1,
      this.compraPinForm.value.fecha.dia])
      .toDate();
		this.pagoPinEvent.emit(this.pagoPin);
	}
}
