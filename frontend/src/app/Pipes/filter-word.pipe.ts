import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filterWord'
})
export class FilterWordPipe implements PipeTransform {

  transform(value: string, ...args: unknown[]): string {
    return value.replace(/p+a+j+e+t+/gi, "p****t");
  }

}
