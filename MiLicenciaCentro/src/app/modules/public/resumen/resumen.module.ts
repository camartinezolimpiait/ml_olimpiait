import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { UtilidadesModule } from "src/app/modules/compartidos/utilidades/utilidades.module";
import { AngularMaterialModule } from "src/app/modules/compartidos/angular-material.module";
import { FormsModule } from "@angular/forms";
import { ResumenRoutingModule } from "./resumen-routing.module";
import { ResumenComponent } from "src/app/components/pages/resumen/resumen.component";

@NgModule({
    declarations: [
        ResumenComponent
    ],
    imports: [
        UtilidadesModule,
        CommonModule,
        FormsModule,
        AngularMaterialModule,
        ResumenRoutingModule
    ]
})
export class ResumenModule { }
