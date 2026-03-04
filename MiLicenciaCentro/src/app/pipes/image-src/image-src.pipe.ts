import { Pipe, PipeTransform } from '@angular/core';
import { environment } from 'src/environments/environment';


@Pipe({
  name: 'imageSrc'
})

/**
 * Agrega la ruta, según ambiente, para que al compilar pueda encontrar 
 * las imagenes
 */
export class ImageSrcPipe implements PipeTransform {

  transform(path: string): string {
    return environment.outputPath + path;
  }

}
