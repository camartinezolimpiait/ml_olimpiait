import { NgModule, LOCALE_ID } from "@angular/core";
import { CommonModule } from "@angular/common";

/* Location*/
import { registerLocaleData } from "@angular/common";
import localeCO from "@angular/common/locales/es-CO";

/* Material Angular*/
import { MatIconModule } from "@angular/material/icon";
import { ReactiveFormsModule } from "@angular/forms";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { MatSnackBarModule } from "@angular/material/snack-bar";
import { MatAutocompleteModule } from "@angular/material/autocomplete";

import {
  MatMomentDateModule,
  MomentDateModule,
} from "@angular/material-moment-adapter";
import { CdkStepperModule, CdkStepper } from "@angular/cdk/stepper";
import { MatSelectModule } from "@angular/material/select";
import { CdkTableModule } from '@angular/cdk/table';
import { MAT_DATE_LOCALE } from "@angular/material/core";
import { MatDialogModule } from "@angular/material/dialog";
import {MatProgressBarModule} from '@angular/material/progress-bar';
import { MatSidenavModule } from '@angular/material/sidenav';
import {MatPaginatorModule} from '@angular/material/paginator';

const defaultLocation = "es-CO";
registerLocaleData(localeCO, defaultLocation);

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    CdkStepperModule,
    ReactiveFormsModule,
    MatMomentDateModule,
    MomentDateModule,
    MatDatepickerModule,
    MatAutocompleteModule,
    MatIconModule,
    MatSnackBarModule,
    MatProgressBarModule,
    MatSidenavModule,
    MatSelectModule,
    MatDialogModule,
    MatIconModule,
    CdkTableModule,
  ],
  exports: [
    CommonModule,
    CdkStepperModule,
    ReactiveFormsModule,
    MatMomentDateModule,
    MatAutocompleteModule,
    MomentDateModule,
    MatDatepickerModule,
    MatProgressBarModule,
    MatSidenavModule,
    MatIconModule,
    MatSnackBarModule,
    MatSelectModule,
    MatDialogModule,
    MatIconModule,
    CdkTableModule,
    MatPaginatorModule
  ],
  providers: [
    { provide: CdkStepper, useValue: undefined },
    { provide: MAT_DATE_LOCALE, useValue: defaultLocation },
    { provide: LOCALE_ID, useValue: defaultLocation },
  ],
})
export class AngularMaterialModule { }
