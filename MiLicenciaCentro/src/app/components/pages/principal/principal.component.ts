import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-principal',
  templateUrl: './principal.component.html',
  styleUrls: ['./principal.component.scss']
})
export class PrincipalComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {// Se ejecuta al inicializar el componente
  }

  onActivate(event:any) {
    document.body.scrollTop = 0;
  }
}
