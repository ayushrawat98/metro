import { Component, ElementRef, output, viewChild } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { ScrollService } from '../../Services/scroll.service';
import { InternaldataService } from '../../Services/internaldata.service';
import { BoardFlipComponent } from '../board-flip/board-flip.component';

@Component({
	selector: 'app-board',
	imports: [BoardFlipComponent],
	templateUrl: './board.component.html',
	styleUrl: './board.component.scss'
})
export class BoardComponent {
	boards = [
		{name : 'b', desc : '/random/'},
		{name : 'yog', desc : '/योग, Lit, Philosophy/'},
		{name : 'pol', desc : '/ayega to modi hi/'},
		{name : 'meta', desc : '/abuse admin here/'},
	]

	constructor(
		private scrollService: ScrollService,
		private router: Router,
		public internalData : InternaldataService
	) { }

	//any board link clicked
	boardChanged(value: string) {
		this.router.navigate(['boards', value])
		this.scrollService.scrollBy(300)
	}

	changeMode(){
		let newTheme = this.internalData.currentTheme()  == 'light' ? 'dark' : 'light'
		this.internalData.currentTheme.set(newTheme as "light" | "dark")
		localStorage.setItem("theme", newTheme)
	}




	//pranks
	// song = viewChild<ElementRef<HTMLAudioElement>>('song')
	// songstate = 'pause'
	// ngOnInit() {
	// 	setTimeout(() => {
	// 		this.song()?.nativeElement.play()
	// 	}, 3000);
	// }
	// pause(){
	// 	if(this.songstate == 'pause'){
	// 		this.songstate = 'play'
	// 		this.song()?.nativeElement.pause()
	// 	}else{
	// 		this.songstate = 'pause'
	// 		this.song()?.nativeElement.play()
	// 	}
	// }
}
