import { Pipe, PipeTransform } from '@angular/core';
import { enumToArrObj } from 'src/app/interfaces/Otros/enumToArrObj';

@Pipe({
  name: 'enumToArr'
})
export class EnumToArrPipe implements PipeTransform {

  transform(value:Object) : enumToArrObj[] {
    let obj = Object.keys(value);
    return obj.filter(e => !isNaN(+e))
    .map((currElement, index) => { return {index: +currElement, name: obj[(obj.length /2) + index].toString() }})
  }
}
