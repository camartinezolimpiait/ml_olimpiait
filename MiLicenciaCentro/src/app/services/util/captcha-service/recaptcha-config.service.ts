import { Injectable } from '@angular/core';
import { ReCaptchaV3Service } from 'ng-recaptcha';
import { Observable, of } from 'rxjs';
import { environment } from 'src/environments/environment';

/**
  * Setea el valor del token Captcha, según el valor booleano de IsRecaptchaActive en environments
  * @param {string} action la accion a ejecutar
  * @returns {Observable<string>} retorna un string, puede ser el token captcha o un string vacío según el caso
*/

@Injectable({
  providedIn: 'root'
})
export class RecaptchaConfigService extends ReCaptchaV3Service {

  override execute(action: string): Observable<string> {
    if (!environment.recaptcha.IsRecaptchaActive) {
      console.warn('reCaptcha disabled empty token');
      return of('');
    }
    // Si IsRecaptchaActive == true, usa el servicio original
    return super.execute(action);
  }
}
