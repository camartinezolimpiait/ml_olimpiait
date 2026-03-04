import { Component, Input, OnInit } from '@angular/core';
import { AbstractControl } from '@angular/forms';

@Component({
  selector: 'app-field-error',
  templateUrl: './field-error.component.html',
  styleUrls: ['./field-error.component.scss']
})
export class FieldErrorComponent implements OnInit {

  @Input() controlForm: AbstractControl | undefined;
  @Input() noControl: boolean = false;

  constructor() { }

  ngOnInit(): void {// Se ejecuta al inicializar el componente
  }

}
