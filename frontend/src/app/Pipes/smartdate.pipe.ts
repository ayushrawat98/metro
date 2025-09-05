import { formatDate } from '@angular/common';
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'smartdate'
})
export class SmartdatePipe implements PipeTransform {

  transform(value: string, ...args: unknown[]): string {
    if (!value) return '';

    const date = new Date(value);
    const today = new Date();

    const isSameDay =
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear();

    if (isSameDay) {
      // Show only time if today
      return formatDate(date, 'hh:mm a', 'en-US');
    } else {
      // Show full date otherwise
      return formatDate(date, 'dd/MM/yyyy', 'en-US');
    }
  }

}
