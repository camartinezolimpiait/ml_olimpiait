import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SharedService {
  private readonly tipoServicioSource = new BehaviorSubject<number | null>(null);
  tipoServicio$ = this.tipoServicioSource.asObservable();

  setTipoServicio(tipo: number) {
    this.tipoServicioSource.next(tipo);
  }
}