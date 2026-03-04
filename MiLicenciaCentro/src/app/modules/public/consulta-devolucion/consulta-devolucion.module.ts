import { NgModule } from "@angular/core";

//Pages
import { ConsultaDevolucionRoutingModule } from "./consulta-devolucion-routing.module";
import { ConsultaDevolucionComponent } from "src/app/components/pages/consulta-devolucion/consulta-devolucion.component";
import { CommonModule } from "@angular/common";
import { UtilidadesModule } from "src/app/modules/compartidos/utilidades/utilidades.module";
import { FormsModule } from "@angular/forms";
import { AngularMaterialModule } from "src/app/modules/compartidos/angular-material.module";
import { RECAPTCHA_V3_SITE_KEY, RecaptchaV3Module, ReCaptchaV3Service } from 'ng-recaptcha';
import { environment } from "src/environments/environment";
import {CambioTipoDevolucionModule} from "../cambio-tipo-devolucion/cambio-tipo-devolucion.module"
import { ActualizacionDatosDevolucionComponent } from "src/app/components/pages/consulta-devolucion/actualizacion-datos-devolucion/actualizacion-datos-devolucion.component";
import { RecaptchaConfigService } from "src/app/services/util/captcha-service/recaptcha-config.service";


@NgModule({
  declarations: [
    ConsultaDevolucionComponent,
    ActualizacionDatosDevolucionComponent
  ],
  imports: [
    UtilidadesModule,
    CommonModule,
    FormsModule,
    AngularMaterialModule,
    ConsultaDevolucionRoutingModule,
    RecaptchaV3Module,
    CambioTipoDevolucionModule,
  ],
  providers: [
    {
      provide: RECAPTCHA_V3_SITE_KEY,
      useValue: environment.recaptcha.siteKey,
    },
    { provide: ReCaptchaV3Service, useClass: RecaptchaConfigService }
  ],
})
export class ConsultaDevolucionModule { }
