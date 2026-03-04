import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { UtilidadesModule } from "src/app/modules/compartidos/utilidades/utilidades.module";
import { AngularMaterialModule } from "src/app/modules/compartidos/angular-material.module";
import { FormsModule } from "@angular/forms";
import { ConfirmOTPComponent } from 'src/app/components/pages/cambio-beneficiario/confirm-otp/confirm-otp.component';
import { SimpleInfoComponent } from 'src/app/components/pages/cambio-beneficiario/simple-info/simple-info.component';
import { ConfirmarOperacionComponent } from 'src/app/components/pages/cambio-beneficiario/confirmar-operacion/confirmar-operacion.component';
import { CambioBeneficiarioRoutingModule } from "./cambio-beneficiario-routing.module";
import { CambioBeneficiarioComponent } from "src/app/components/pages/cambio-beneficiario/cambio-beneficiario.component";

@NgModule({
    declarations: [
        CambioBeneficiarioComponent,
        ConfirmOTPComponent,
        SimpleInfoComponent,
        ConfirmarOperacionComponent,
    ],
    imports: [
        UtilidadesModule,
        CommonModule,
        FormsModule,
        AngularMaterialModule,
        CambioBeneficiarioRoutingModule
    ]
})
export class CambioBeneficiarioModule { }
