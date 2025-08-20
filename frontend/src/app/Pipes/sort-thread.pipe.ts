import { Pipe, PipeTransform } from '@angular/core';
import { reply, thread } from '../Models/thread';

@Pipe({
  name: 'sortThread'
})
export class SortThreadPipe implements PipeTransform {

  transform(value: thread[], ...args: unknown[]): thread[] {
	let temp = [...value]
	return temp.sort((a : thread, b : thread) =>  {
		if(a.updated_at  > b.updated_at){
			return -1
		}else if(a.updated_at <  b.updated_at){
			return 1
		}else{
			return 0
		}
	})
  }

}
