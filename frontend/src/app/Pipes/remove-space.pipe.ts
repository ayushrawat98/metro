import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'removeSpace'
})
export class RemoveSpacePipe implements PipeTransform {

  transform(value: string, ...args: unknown[]): string {
    return value.replace(/(\r\n|\n|\r){3,}/g, "\r\n\r\n")
  }

}


