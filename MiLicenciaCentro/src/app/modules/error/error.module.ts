import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ErrorRoutingModule } from './error-routing.module';
import { ErrorComponent } from "src/app/components/pages/error/error.component";
import { AngularMaterialModule } from "../compartidos/angular-material.module";
import { UtilidadesModule } from "../compartidos/utilidades/utilidades.module";

@NgModule({
  declarations: [ErrorComponent],
  imports: [
    CommonModule,
    ErrorRoutingModule,
    AngularMaterialModule,
    UtilidadesModule
  ]
})
export class ErrorModule { }
