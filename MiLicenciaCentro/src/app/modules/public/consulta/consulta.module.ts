import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RECAPTCHA_V3_SITE_KEY, RecaptchaV3Module, ReCaptchaV3Service } from 'ng-recaptcha';
import { environment } from 'src/environments/environment';

import { ConsultaRoutingModule } from './consulta-routing.module';
import { ConsultaPinComponent } from 'src/app/components/pages/consulta-pin/consulta-pin.component';
import { UtilidadesModule } from "src/app/modules/compartidos/utilidades/utilidades.module";
import { AngularMaterialModule } from "src/app/modules/compartidos/angular-material.module";
import { PagoCuotasComponent } from 'src/app/components/pages/pago-cuotas/pago-cuotas.component';
import { MetodosRecaudoComponent } from 'src/app/components/pages/pago-cuotas/metodos-recaudo/metodos-recaudo.component';
import { ConsultaCitasCeaComponent } from '../../../components/pages/consulta-citas-cea/consulta-citas-cea.component';
import { RecaptchaConfigService } from 'src/app/services/util/captcha-service/recaptcha-config.service';

@NgModule({
  declarations: [
    ConsultaPinComponent,
    PagoCuotasComponent,
    MetodosRecaudoComponent,
    ConsultaCitasCeaComponent
  ],
  imports: [
    CommonModule,
    AngularMaterialModule,
    UtilidadesModule,
    ConsultaRoutingModule,
    RecaptchaV3Module,
  ],
  providers: [
    {
      provide: RECAPTCHA_V3_SITE_KEY,
      useValue: environment.recaptcha.siteKey,
    },
    { provide: ReCaptchaV3Service, useClass: RecaptchaConfigService }
  ],
})
export class ConsultaModule { }
