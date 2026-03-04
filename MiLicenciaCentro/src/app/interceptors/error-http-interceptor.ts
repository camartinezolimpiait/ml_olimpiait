import {
  HttpInterceptor,
  HttpHandler,
  HttpRequest,
  HttpEvent,
  HttpErrorResponse,
} from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, of } from "rxjs";
import { catchError } from "rxjs/operators";
import { UtilService } from "src/app/services/util/util.service";
import { Icons } from 'src/app/enums/Utils/Icons';
import { Router } from "@angular/router";
import { UtilGeneralService } from "src/app/services/data/util-general/utilGeneral.service";
import { LogMLFront } from "src/app/interfaces/Otros/LogMLFront";
import { DataService } from "src/app/services/data/cotizador/data.service";
import { environment } from "src/environments/environment.prod";

/**
 * Muestra un mensaje cuando ha ocurrido un error de comunicación en el servidor.
 * Es INYECTADO en cada petición HTTP
 */
@Injectable()
export class AppHttpInterceptor implements HttpInterceptor {
  constructor(private readonly _utils: UtilService, private readonly router: Router,
    private readonly _utilGeneral: UtilGeneralService, private readonly _dataService: DataService) { }
  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      catchError((err) => {
        if (err instanceof HttpErrorResponse) {
          try {
            //suscribe al error error  
            this._utilGeneral.errorHttpSubject$.next(err);
            if (!err.url?.includes("servicios")){
              //guardar log
              let logMLFront :LogMLFront = {
                Metodo: "Servicio Externo",
                Mensaje: err.message,
                MensajeCompleto: JSON.stringify(err)
              };
              this._dataService.log(logMLFront).subscribe();
            } 
            else{
              this.MessageError(environment.production, err);
            }
          } catch (e) {
            this._utils.abrirAlerta(
              "Algo ha salido mal. Por favor, intente más tarde."
            );
          }
        }
        return of(err);
      })
    );
  }

  private MessageError(produccion: boolean, err: HttpErrorResponse): void {
    if (produccion) {
      console.log(
        'No se ha podido establecer comunicación con el servidor',
        err.url
      );
    } else {
      this._utils.abrirDialogo(
        'No se ha podido establecer comunicación con el servidor. Por favor intente más tarde',
        Icons.error
      );
    }
  }
}
