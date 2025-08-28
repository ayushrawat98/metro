import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'removeSpace'
})
export class RemoveSpacePipe implements PipeTransform {

  transform(value: string, ...args: unknown[]): string {
    return value.replace(/(\r\n|\r|\n){2,}/g, '$1\n')
  }

}
