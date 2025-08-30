import { Component, input } from '@angular/core';

@Component({
	selector: 'app-board-flip',
	imports: [],
	templateUrl: './board-flip.component.html',
	styleUrl: './board-flip.component.scss'
})
export class BoardFlipComponent {
	flip = false
	board = input<string>()
	desc = input<string>()
	constructor() {
		setTimeout(() => {
			this.flip = true
			setTimeout(() => {
				this.flip = false
			}, 3000);
		}, Math.random()*6000);
	}
}
