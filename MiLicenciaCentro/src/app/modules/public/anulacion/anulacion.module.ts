import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { AnulacionRoutingModule } from "./anulacion-routing.module";
import { AnulacionComponent } from "src/app/components/pages/anulacion/anulacion.component";

import { UtilidadesModule } from "src/app/modules/compartidos/utilidades/utilidades.module";
import { AngularMaterialModule } from "src/app/modules/compartidos/angular-material.module";
import { FormsModule } from "@angular/forms";
import { ConfirmOTPComponent } from 'src/app/components/pages/anulacion/confirm-otp/confirm-otp.component';
import { SimpleInfoComponent } from 'src/app/components/pages/anulacion/simple-info/simple-info.component';
import { ConfirmarOperacionComponent } from 'src/app/components/pages/anulacion/confirmar-operacion/confirmar-operacion.component';
import { RECAPTCHA_V3_SITE_KEY, RecaptchaV3Module, ReCaptchaV3Service } from 'ng-recaptcha';
import { environment } from "src/environments/environment";
import { RecaptchaConfigService } from "src/app/services/util/captcha-service/recaptcha-config.service";

@NgModule({
    declarations: [
        AnulacionComponent,
        ConfirmOTPComponent,
        SimpleInfoComponent,
        ConfirmarOperacionComponent,
    ],
    imports: [
        UtilidadesModule,
        CommonModule,
        FormsModule,
        AngularMaterialModule,
        AnulacionRoutingModule,
        RecaptchaV3Module
    ],
    
    providers: [
        {
          provide: RECAPTCHA_V3_SITE_KEY,
          useValue: environment.recaptcha.siteKey,
        },
        { provide: ReCaptchaV3Service, useClass: RecaptchaConfigService }
    ],
})  
export class AnulacionModule { }
