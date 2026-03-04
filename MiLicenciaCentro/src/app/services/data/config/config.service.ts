import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { StrictRequestFields } from 'src/app/enums/Utils/strict-request-fields.enum';

@Injectable({
  providedIn: 'root'
})
export class ConfigService {
  private config: any;

  constructor(private readonly http: HttpClient) {

  }
  private readonly Parts = [
    'Zx', 'Qm', 'Yt', 'Bk', 'Pf', 'Lw', 'Hn', 'Dj'
  ];

  private readonly Order = [3, 0, 4, 7, 5, 1, 2, 6];

  private readonly Key = this.#Obtener();
  
  #Obtener(): string {
    return this.Order.map(index => this.Parts[index]).join('');
  }

  loadConfig() {
    return this.http.get('/assets/config/config.json').toPromise().then(data => {
      this.config = data;    
      return this.config;
    });
  }


      

  getDeofuscatedDato1(): string {
    return this.#deofuscate(StrictRequestFields.fieldIdentity);
  }

  getDeofuscatedDato2(): string {
    return this.#deofuscate(StrictRequestFields.fieldValue);
  }

  #deofuscate(value: string): string {
    let result = this.#metodo1(value);
    result = this.#metodo2(result);
    return this.#metodo3(result);
  }

  #metodo3(value: string): string {
    return value.split('').map((char, index) => 
      String.fromCharCode(char.charCodeAt(0) ^ this.Key.charCodeAt(index % this.Key.length))
    ).join('');
  }

  #metodo2(value: string): string {
    return value.split('').reverse().join('');
  }

  #metodo1(value: string): string {
    return atob(value);
  }
}