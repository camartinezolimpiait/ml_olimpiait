import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { EnumToArrPipe } from "src/app/pipes/enum-to-arr/enum-to-arr.pipe";
import { ImageSrcPipe } from "src/app/pipes/image-src/image-src.pipe";
import { FormsModule } from "@angular/forms";
import { FooterComponent } from "src/app/components/common/footer/footer.component";
import { RouterModule } from '@angular/router';
import { Time24to12Pipe } from 'src/app/pipes/time/time24to12.pipe';
import { FieldErrorComponent } from 'src/app/components/common/field-error/field-error.component';
import { DialogoSimpleComponent } from 'src/app/components/common/dialogo-simple/dialogo-simple.component';

@NgModule({
  declarations: [
    ImageSrcPipe,
    EnumToArrPipe,
    FooterComponent,
    FieldErrorComponent,
    Time24to12Pipe,
    DialogoSimpleComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
  ],
  exports: [
    ImageSrcPipe,
    EnumToArrPipe,
    Time24to12Pipe,
    FooterComponent,
    FieldErrorComponent
  ],
})
export class UtilidadesModule { }
