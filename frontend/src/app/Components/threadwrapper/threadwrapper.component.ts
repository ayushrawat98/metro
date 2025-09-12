import { Component, ElementRef, Inject, viewChild } from '@angular/core';
import { ScrollService } from '../../Services/scroll.service';
import { RouterOutlet } from '@angular/router';
import { ThreadComponent } from '../thread/thread.component';


@Component({
	selector: 'app-threadwrapper',
	imports: [RouterOutlet, RouterOutlet, ThreadComponent],
	providers : [{provide : 'mainContainer' , useClass : ScrollService}, {provide : 'repliesContainer' , useClass : ScrollService}],
	templateUrl: './threadwrapper.component.html',
	styleUrl: './threadwrapper.component.scss'
})
export class ThreadwrapperComponent {
	scrollContainer = viewChild<ElementRef<HTMLElement>>('container')
	repliesContainer = viewChild<ElementRef<HTMLElement>>('repliesContainer')

	constructor(
		@Inject('mainContainer') private scrollServiceMain: ScrollService,
		@Inject('repliesContainer') private scrollServiceReplies: ScrollService
	) { }

	ngAfterViewInit(): void {
		this.scrollServiceMain.registerContainer(this.scrollContainer())
		this.scrollServiceReplies.registerContainer(this.repliesContainer())
	}

	scrollDown = true
	scroll(){
		if(this.scrollDown){
			this.scrollServiceReplies.scrollBottom()
		}else{
			this.scrollServiceReplies.scrollUp()
		}
		this.scrollDown = !this.scrollDown
	}
}
