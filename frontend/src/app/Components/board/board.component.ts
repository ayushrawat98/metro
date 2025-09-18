import { Component, ElementRef, inject, output, viewChild } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
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
		// {name : 'yog', desc : '/योग/'},
		// {name : 'fa', desc : '/fashion/'},
		{name : 'g', desc : '/technology/'},
		// {name : 'dharm', desc : '/धर्म/'},
		{name : 'out', desc : '/बाहर जाओ/'},
		{name : 'media', desc : '/music&movies/'},
		{name : 'meta', desc : '/abuse admin/'},
	]

	scrollService = inject(ScrollService)
	router = inject(Router)
	internalData = inject(InternaldataService)
	route = inject(ActivatedRoute)

	//any board link clicked
	boardChanged(value: string) {
		this.router.navigate(['boards', value], {relativeTo : this.route})
		this.scrollService.scrollBy(300)
	}

	changeMode(){
		this.internalData.darkTheme.update((value) => !value)
		localStorage.setItem("darkTheme", this.internalData.darkTheme().valueOf().toString())
	}

	//pranks
	song = viewChild<ElementRef<HTMLAudioElement>>('song')
	songstate = 'pause'
	ngOnInit() {
		setTimeout(() => {
			this.song()?.nativeElement.play()
		}, 3000);
	}
	pause(){
		if(this.songstate == 'pause'){
			this.songstate = 'play'
			this.song()?.nativeElement.pause()
		}else{
			this.songstate = 'pause'
			this.song()?.nativeElement.play()
		}
	}
}
