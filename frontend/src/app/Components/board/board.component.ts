import { Component, ElementRef, output, viewChild } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { ScrollService } from '../../Services/scroll.service';

@Component({
	selector: 'app-board',
	imports: [],
	templateUrl: './board.component.html',
	styleUrl: './board.component.scss'
})
export class BoardComponent {
	boards = ['b', 'fit', 'fa', 'g', 'art', 'music', 'movies']

	constructor(private scrollService: ScrollService, private router: Router) { }

	boardChanged(value: string) {
		this.router.navigate(['boards', value])
		this.scrollService.scrollBy(300)
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
