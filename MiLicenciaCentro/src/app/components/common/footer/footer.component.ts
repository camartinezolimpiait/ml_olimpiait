import { Component, OnInit } from '@angular/core';
import { rutas } from 'src/app/const/rutas';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit {
  paginasCliente: any = rutas.mlCliente.tramites
  procesosBanco: any = rutas.mlCliente.procesosBanco
  
  constructor() { }

  ngOnInit(): void {// Se ejecuta al inicializar el componente
  }

}
