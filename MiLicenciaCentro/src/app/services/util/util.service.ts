import { Injectable } from '@angular/core';
import { AbstractControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Title } from '@angular/platform-browser';
import { Params, Router } from '@angular/router';
import { DialogoSimpleComponent } from 'src/app/components/common/dialogo-simple/dialogo-simple.component';
import { TipoCliente } from 'src/app/enums/PinesOlimpia/TipoCliente';
import { TipoDocumento } from 'src/app/enums/TipoDocumento';
import { environment } from 'src/environments/environment';
import { seoPorPagina } from './seoPorPagina';

@Injectable({
  providedIn: 'root',
})
/**
 * Servicio que expone metodos comunes entre los componentes.
 */
export class UtilService {
  constructor(
    private readonly _snackBar: MatSnackBar,
    private readonly _dialog: MatDialog,
    private readonly _router: Router,
    private readonly _titulo: Title
  ) {}
  dialogRef: MatDialogRef<DialogoSimpleComponent> | undefined;
  tipoCliente: any = TipoCliente;

  /**
   * Objeto de SEO
   * por pagina, se debe colocar titulo, descripcion y keywords.
   */
  private readonly _seo = seoPorPagina;

  /**
   * Retorna un objeto con los datos de SEO,
   * dependiendo de la página
   */
  public get seo() {
    return this._seo;
  }

  /**
   * Tipos de documento que solo contienen numeros
   */
  tiposDeDocumentoNumericos: number[] = [
    TipoDocumento.CedulaCiudadania,
    TipoDocumento.TarjetaIdentidad,
    4, //adicciona el tipo 4 Nit
  ];
  /**
   * Abre un dialogo para mostrar el resultado de una operacion
   * @param mensaje Mensaje a mostrar
   * @param logo Ruta del logo a mostrar
   */
  public abrirDialogo(mensaje: string, logo: string) {
    this.dialogRef = this._dialog.open(DialogoSimpleComponent, {
      data: [mensaje, logo],
      width: '22rem',
      autoFocus: false,
    });
  }
  public abrirDialogoConfirmUpdate(mensaje: string, logo: string): any {
    this.dialogRef = this._dialog.open(DialogoSimpleComponent, {
      data: [mensaje, logo],
      width: '22rem',
      autoFocus: false,
    });
    return this.dialogRef;
  }
  /**
   * Muestra el mensaje solicitado
   * @param message Mensaje para mostrar en caso de información/solicitud érronea o denegada
   */
  abrirAlerta(message: string) {
    this._snackBar.open(message, 'Aceptar', {
      duration: 10000,
      // panelClass: ['blue-snackbar']
    });
  }
  /**
   * Cambia la ruta interna para que concuerde con el environment
   */
  cambiarRutaInterna(ruta: string, parametros?: Params) {
    this._router.navigate([environment.routingPrefix + ruta], {
      queryParams: parametros,
    });
  }

  /**
   * Quita el enmascaramiento del campo solicitado.
   * @param val Valor a desenmascarar
   * @param docSelected Tipo de documento seleccionado
   * @param isPhone ¿Es máscara de teléfono?
   */
  desenmascararValor(val: string, docSelected: number, isPhone?: boolean) {
    let asegurarTipoNumerico = +docSelected;
    let valorConvertido: string;
    if (
      this.tiposDeDocumentoNumericos.includes(asegurarTipoNumerico) ||
      isPhone
    ) {
      let tmp = val.replace(' ', '').split('-');
      if (asegurarTipoNumerico == 4 && tmp.length > 1) {
        valorConvertido =
          tmp[0].replace(/\D+/g, '') + '-' + tmp[1].replace(/\D+/g, '');
      } else {
        valorConvertido = val.replace(/\D+/g, '');
      }
    } else valorConvertido = val.replace(/[^0-9a-zA-Z]/g, '');
    return valorConvertido;
  }

  /**
   * Incluir dinamicamente mensajes de error
   * @param formulario formulario a evaluar
   * @param campos Campos a evaluar
   * @param mensajesError Objeto con mensajes de error
   */
  public validarErroresFormulario(
    formulario: any,
    campos: any,
    mensajesError: any
  ) {
    if (!formulario) {
      return;
    }
    const form: FormGroup = formulario;
    for (const field in campos) {
      this.asignarMensajeDeError(campos, field, form, mensajesError);
    }
  }

  private asignarMensajeDeError(
    campos: any,
    field: string,
    form: FormGroup,
    mensajesError: any
  ) {
    if (campos.hasOwnProperty(field)) {
      campos[field] = '';
      const control: any = form.get(field);
      if (control && control.dirty && control.invalid) {
        const messages = mensajesError[field];
        for (const key in control.errors) {
          if (control.errors.hasOwnProperty(key)) {
            campos[field] += messages[key] + ' ';
          }
        }
      }
    }
  }

  public validarField(
    field: string,
    formulario: any,
    campos: any,
    mensajesError: any
  ) {
    if (!formulario) {
      return;
    }
    const form: FormGroup = formulario;
    const control: any = form.get(field);
    control.updateValueAndValidity();
    if (control && control.dirty && control.invalid) {
      const messages = mensajesError[field];
      for (const key in control.errors) {
        if (control.errors.hasOwnProperty(key)) {
          campos[field] += messages[key] + ' ';
        }
      }
    }
  }

  public validarNumeroDocumento(
    form: FormGroup,
    tipoDocumento: string,
    Field: string,
    camposValidacion: any,
    mensajesValidacion: any,
    tipoCliente: number
  ) {
    let pattern: string = ' ';
    let minChars: number = 6;
    let mensaje = mensajesValidacion[Field].pattern;

    switch (Number(form.controls[tipoDocumento].value)) {
      case TipoDocumento.CedulaCiudadania:
        pattern = '^([0-9]{1,10})$';
        if (mensaje !== undefined) {
          mensajesValidacion[Field].pattern =
            'Se aceptan solamente números de hasta 10 dígitos';
        }
        break;
      case TipoDocumento.CedulaExtranjeria:
        pattern = '^([0-9]{1,10})$';
        if (mensaje !== undefined) {
          mensajesValidacion[Field].pattern = 'Se aceptan solamente números de hasta 10 dígitos';
        }
        break;
      case TipoDocumento.Pasaporte:
        pattern = '^([0-9a-zA-Z]{1,24})$';
        if (mensaje !== undefined) {
          mensajesValidacion[Field].pattern =
            'El pasaporte debe tener hasta 24 caracteres';
        }
        break;
      case TipoDocumento.TarjetaIdentidad:
        pattern = '^([0-9]{1,10})$';
        minChars = 10;
        if (mensaje !== undefined) {
          mensajesValidacion[Field].pattern =
            'Se aceptan solamente números de hasta 10 dígitos';
        }
        break;
      case TipoDocumento.PermisoProteccionTemporal:
        pattern = '^([0-9]{1,7})$';
        if (mensaje !== undefined) {
          mensajesValidacion[Field].pattern =
            'Se aceptan solamente números de hasta 7 dígitos';
        }
        break;
        case TipoDocumento.PermisoEspecialPermanencia:
        pattern = '^([0-9]{1,15})$';
        minChars = 15;
        if (mensaje !== undefined) {
          mensajesValidacion[Field].pattern =
            'Se aceptan solamente números de hasta 15 dígitos';
        }
        break;
        case TipoDocumento.RegistroCivil:
        pattern = '^([0-9]{1,10})$';
        minChars = 10;
        if (mensaje !== undefined) {
          mensajesValidacion[Field].pattern =
            'Se aceptan solamente números de hasta 10 dígitos';
        }
        break;
        case TipoDocumento.NUIP:
        pattern = '^([0-9]{1,10})$';
        minChars = 10;
        if (mensaje !== undefined) {
          mensajesValidacion[Field].pattern =
            'Se aceptan solamente números de hasta 10 dígitos';
        }
        break;
        case TipoDocumento.NIT:
        pattern = '^([0-9]{9,15})$';
        minChars = 9;
        if (mensaje !== undefined) {
          mensajesValidacion[Field].pattern =
            'Se aceptan solamente números de 9 hasta 15 dígitos';
        }
        break;
      default:
        pattern = '^([0-9]{1,15})$';
        if (mensaje !== undefined) {
          mensajesValidacion[Field].pattern = 'Se aceptan solamente números';
        }
        break;
    }

    form.controls[Field].setValidators([
      Validators.required,
      Validators.minLength(minChars),
      Validators.maxLength(24),
      Validators.pattern(pattern),
    ]);
    this.validarField(Field, form, camposValidacion, mensajesValidacion);
  }

  /**
   * Cambia el titulo de la pagina en el head
   */
  cambiarTituloPagina(titulo: string) {
    this._titulo.setTitle(titulo);
  }
}
