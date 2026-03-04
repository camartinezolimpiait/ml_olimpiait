import { NgModule } from "@angular/core";

/*Pages*/
import { CambioTipoDevolucionRoutingModule } from "./cambio-tipo-devolucion-routing.module";
import { CambioTipoDevolucionComponent} from "src/app/components/pages/cambio-tipo-devolucion/cambio-tipo-devolucion.component";
import { CommonModule } from "@angular/common";
import { UtilidadesModule } from "src/app/modules/compartidos/utilidades/utilidades.module";
import { FormsModule } from "@angular/forms";
import { AngularMaterialModule } from "src/app/modules/compartidos/angular-material.module";
import { RecaptchaV3Module, ReCaptchaV3Service } from 'ng-recaptcha';
import { RecaptchaConfigService } from "src/app/services/util/captcha-service/recaptcha-config.service";

@NgModule({
  declarations: [
    CambioTipoDevolucionComponent,
  ],
  imports: [
    UtilidadesModule,
    CommonModule,
    FormsModule,
    AngularMaterialModule,
    CambioTipoDevolucionRoutingModule,
    RecaptchaV3Module,
  ],
  exports:[
    CambioTipoDevolucionComponent,
  ],
  providers:[
    { provide: ReCaptchaV3Service, useClass: RecaptchaConfigService }
  ]
})
export class CambioTipoDevolucionModule { }
