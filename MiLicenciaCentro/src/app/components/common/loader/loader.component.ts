import { Component, OnInit } from '@angular/core';
import { LoaderService } from 'src/app/services/loader/loader.service';

@Component({
  selector: 'app-loader',
  templateUrl: './loader.component.html',
  styleUrls: ['./loader.component.scss']
})
export class LoaderComponent implements OnInit {

  isLoading = false;
  constructor(private readonly _loaderService:LoaderService) {
    this._loaderService.isLoading.subscribe((load:boolean)=> this.isLoading = load)
  }
  ngOnInit() {// Se ejecuta al inicializar el componente
  }

}