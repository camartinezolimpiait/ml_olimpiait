import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { NavigationComponent } from "src/app/components/common/navigation/navigation.component";
import { PrincipalComponent } from "src/app/components/pages/principal/principal.component";
import { AngularMaterialModule } from "../../compartidos/angular-material.module";
import { UtilidadesModule } from "../../compartidos/utilidades/utilidades.module";
import { SharedComponentModule } from "../../shared-component/shared-component.module";
import { PrincipalRoutingModule } from "./principal-routing.module";

@NgModule({
    declarations: [
        NavigationComponent,
        PrincipalComponent,
       
    ],
    imports: [
        CommonModule,
        PrincipalRoutingModule,
        SharedComponentModule,
        AngularMaterialModule,
        UtilidadesModule
    ],
})
export class PrincipalModule { }
