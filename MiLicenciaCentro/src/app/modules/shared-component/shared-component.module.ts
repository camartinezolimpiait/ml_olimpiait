import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CenterInfoComponent } from 'src/app/components/common/center-info/center-info.component';

import { FormsModule } from "@angular/forms";
import { UtilidadesModule } from 'src/app/modules/compartidos/utilidades/utilidades.module';


@NgModule({
  declarations: [
    CenterInfoComponent,
  ],
  imports: [
    FormsModule,
    CommonModule,
    UtilidadesModule
  ],
  exports: [
    CenterInfoComponent,
  ]
})
export class SharedComponentModule { }
