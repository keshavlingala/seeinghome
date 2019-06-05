import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
  name: 'formatTime'
})
export class FormatTimePipe implements PipeTransform {

  transform(value: number): string {
    const sec = 1000;
    const min = sec * 60;
    const hour = min * 60;
    const day = hour * 24;
    const days = Math.round(value / day);
    const hours = Math.round((value / hour) - days * 24);
    const mins = Math.round((value / min) - hours * 60);
    return days + ' Days ' + hours + ' Hours ' + mins + ' Mins';
  }
}
