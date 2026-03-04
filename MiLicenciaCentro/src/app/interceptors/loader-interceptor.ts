import { Injectable } from "@angular/core";
import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest
} from "@angular/common/http";
import { Observable } from "rxjs";
import { LoaderService } from "src/app/services/loader/loader.service"
import { finalize } from "rxjs/operators";

/**
 * Muestra un gif al momento de esperar por la respuesta del servidor.
 * Es INYECTADO en cada petición HTTP 
 */
@Injectable()
export class LoaderInterceptor implements HttpInterceptor {
  activeRequests: number = 0;

  /**
   * URLs en las que no es necesario el intercept
   */
  skipURLs = ["/404"];

  constructor(private readonly cargardorService: LoaderService) {}

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    let displayLoadingScreen = true;

    for (const skippUrl of this.skipURLs) {
      if (new RegExp(skippUrl).test(request.url)) {
        displayLoadingScreen = false;

        break;
      }
    }

    if (displayLoadingScreen) {
      if (this.activeRequests === 0) {
        this.cargardorService.show();
      }

      this.activeRequests++;

      return next.handle(request).pipe(
        finalize(() => {
          this.activeRequests--;

          if (this.activeRequests === 0) {
            this.cargardorService.hide();
          }
        })
      );
    } else {
      return next.handle(request);
    }
  }
}
