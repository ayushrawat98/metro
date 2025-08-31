import { Pipe, PipeTransform } from '@angular/core';
import { reply, thread } from '../Models/thread';

@Pipe({
	name: 'sortThread'
})
export class SortThreadPipe implements PipeTransform {

	transform(value: thread[], ...args: unknown[]): thread[] {
		let temp = [...value]
		return temp.sort((a, b) => this.score(b.replycount, b.created_at) - this.score(a.replycount, a.created_at))
		// return temp.sort((a : thread, b : thread) =>  {
		// 	if(a.updated_at  > b.updated_at){
		// 		return -1
		// 	}else if(a.updated_at <  b.updated_at){
		// 		return 1
		// 	}else{
		// 		return 0
		// 	}
		// })
	}

	score(r: number, t: string): number {
		let time = (Date.now() - new Date(t).getTime()) / (1000*60*60)
		return (r+50)*(0.99**time)
	}

}
