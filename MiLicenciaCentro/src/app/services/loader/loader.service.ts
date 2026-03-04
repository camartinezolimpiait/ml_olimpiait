import { Injectable } from '@angular/core';
import {Subject} from 'rxjs';

@Injectable({
  providedIn: 'root'
})

/**
 * Agrega un gif de carga cuando se realiza una petición http
 */
export class LoaderService {

  constructor() { }
  isLoading = new Subject<boolean>();
  show(){
    this.isLoading.next(true);
  }

  hide(){
    this.isLoading.next(false);
  }
}
