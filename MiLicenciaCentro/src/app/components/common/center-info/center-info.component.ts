import { Component, OnInit, Input } from "@angular/core";

@Component({
  selector: "app-center-info",
  templateUrl: "./center-info.component.html",
  styleUrls: ["./center-info.component.scss"]
})
export class CenterInfoComponent implements OnInit {
  @Input() name!: string;
  @Input() address!: string;
  @Input() email!: string;
  @Input() telephone!: string;
  @Input() cellphone!: string;

  constructor() {}

  ngOnInit() { // Initialization logic can be added here if needed
        }

  quitarAbreviaciones(input: string) {
    let filtroAvenidaCarrera = /\b(ak|acr)\b/;
    let filtroAvenidaCalle = /\b(ac|avcl)\b/;
    let filtroAvenida = /\b(ave|av)\b/;
    let filtroCalle = /\b(c|cl|cll|clle|cale|call)\b/;
    let filtroCarrera = /\b(cr|cra|k|kr|kra|crr|car)\b/;
    let filtroTransversal = /\b(trans|transv|tranv|trv|tv|tvr)\b/;
    let filtroDiagonal = /\b(dg|dig|diag)\b/;
    let filtroVereda = /\b(vr|vda)\b/;
    let filtroManzana = /\b(mza)\b/;
    let filtroKilometro = /\b(km|kto)\b/;
    let filtroGuiones = /(\s?–\s?|\s?-\s?)/g;
    let filtroEspeciales = /[^a-zA-Z0-9-# ]/g;
    let filtroNum = /\s(no|n)\s/g;

    input = input.replace(filtroAvenidaCarrera, "avenida carrera");
    input = input.replace(filtroAvenidaCalle, "avenida calle");
    input = input.replace(filtroAvenida, "avenida");
    input = input.replace(filtroCalle, "calle");
    input = input.replace(filtroCarrera, "carrera");
    input = input.replace(filtroTransversal, "transversal");
    input = input.replace(filtroDiagonal, "diagonal");
    input = input.replace(filtroVereda, "vereda");
    input = input.replace(filtroManzana, "manzana");
    input = input.replace(filtroKilometro, "kilometro");
    input = input.replace(filtroGuiones, " - ");
    input = input.replace(filtroEspeciales, "");
    input = input.replace(filtroNum, " # ");

    return input;
  }
}


