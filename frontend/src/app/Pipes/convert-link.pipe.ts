import { Pipe, PipeTransform } from '@angular/core';
import { Converted } from '../Models/thread';

@Pipe({
	name: 'convertLink'
})
export class ConvertLinkPipe implements PipeTransform {

	transform(content: string, ...args: unknown[]): Converted[] {
		const regex = />>(\d+)/g;
		const parts: Converted[] = [];
		let lastIndex = 0;
		let match;
		let yourreplies = localStorage.getItem("replies")?.split(',')
		let currentThread = localStorage.getItem("currentThread")

		while ((match = regex.exec(content)) !== null) {
			if (match.index > lastIndex) {
				parts.push({ type: 'text', value: content.slice(lastIndex, match.index) });
			}
			let tempvaluestring = ""
			if(yourreplies && yourreplies.includes(match[1])){
				tempvaluestring += " (You)"
			}
			if(currentThread && currentThread == match[1]){
				tempvaluestring += " (OP)"
			}
			parts.push({ type: 'link', value: match[1], shownValue: match[1]+tempvaluestring});
			
			lastIndex = regex.lastIndex;
		}

		if (lastIndex < content.length) {
			parts.push({ type: 'text', value: content.slice(lastIndex), shownValue : content.slice(lastIndex) });
		}

		return parts;
	}

}
