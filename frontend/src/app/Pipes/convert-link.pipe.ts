import { Pipe, PipeTransform } from '@angular/core';
import { Converted } from '../Models/thread';
import { InternaldataService } from '../Services/internaldata.service';

@Pipe({
	name: 'convertLink'
})
export class ConvertLinkPipe implements PipeTransform {

	constructor(private internalData: InternaldataService) { }

	transform(content: string, ...args: unknown[]): Converted[] {
		const regex = />>(\d+)/g;
		const parts: Converted[] = [];
		let lastIndex = 0;
		let match;
		let yourreplies = localStorage.getItem("replies")?.split(',')
		let currentThread = this.internalData.currentThread()

		while ((match = regex.exec(content)) !== null) {
			if (match.index > lastIndex) {
				// Get the text before the match
				let before = content.slice(lastIndex, match.index);

				// Split into lines and check for > greenline
				before.split("\n").forEach(line => {
					if (line.startsWith(">")) {
						parts.push({ type: 'greenline', value: line });
					} else if (line.length > 0) {
						parts.push({ type: 'text', value: line });
					}
				});
			}

			let tempvaluestring = "";
			if (yourreplies && yourreplies.includes(match[1])) {
				tempvaluestring += " (You)";
			}
			if (currentThread && currentThread == match[1]) {
				tempvaluestring += " (OP)";
			}
			parts.push({ type: 'link', value: match[1], shownValue: match[1] + tempvaluestring });

			lastIndex = regex.lastIndex;
		}

		if (lastIndex < content.length) {
			let remaining = content.slice(lastIndex);
			remaining.split("\n").forEach(line => {
				if (line.startsWith(">")) {
					parts.push({ type: 'greenline', value: line });
				} else if (line.length > 0) {
					parts.push({ type: 'text', value: line, shownValue: line });
				}
			});
		}

		return parts;


		// while ((match = regex.exec(content)) !== null) {
		// 	if (match.index > lastIndex) {
		// 		parts.push({ type: 'text', value: content.slice(lastIndex, match.index) });
		// 	}
		// 	let tempvaluestring = ""
		// 	if(yourreplies && yourreplies.includes(match[1])){
		// 		tempvaluestring += " (You)"
		// 	}
		// 	if(currentThread && currentThread == match[1]){
		// 		tempvaluestring += " (OP)"
		// 	}
		// 	parts.push({ type: 'link', value: match[1], shownValue: match[1]+tempvaluestring});

		// 	lastIndex = regex.lastIndex;
		// }

		// if (lastIndex < content.length) {
		// 	parts.push({ type: 'text', value: content.slice(lastIndex), shownValue : content.slice(lastIndex) });
		// }

		// return parts;
	}

}
