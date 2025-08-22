import { Pipe, PipeTransform } from '@angular/core';
import { Converted } from '../Models/thread';

@Pipe({
	name: 'convertLink'
})
export class ConvertLinkPipe implements PipeTransform {

	transform(content: string, ...args: unknown[]): Converted[] {
		const regex = />>(\d+)/g;
		const parts: { type: 'text' | 'link', value: string }[] = [];
		let lastIndex = 0;
		let match;

		while ((match = regex.exec(content)) !== null) {
			if (match.index > lastIndex) {
				parts.push({ type: 'text', value: content.slice(lastIndex, match.index) });
			}
			parts.push({ type: 'link', value: match[1] });
			lastIndex = regex.lastIndex;
		}

		if (lastIndex < content.length) {
			parts.push({ type: 'text', value: content.slice(lastIndex) });
		}

		return parts;
	}

}
