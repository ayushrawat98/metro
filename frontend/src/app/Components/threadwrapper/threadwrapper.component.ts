import { Component, ElementRef, viewChild } from '@angular/core';
import { ScrollService } from '../../Services/scroll.service';
import { RouterOutlet } from '@angular/router';
import { ThreadComponent } from '../thread/thread.component';


@Component({
	selector: 'app-threadwrapper',
	imports: [RouterOutlet, RouterOutlet, ThreadComponent],
	providers : [ScrollService],
	templateUrl: './threadwrapper.component.html',
	styleUrl: './threadwrapper.component.scss'
})
export class ThreadwrapperComponent {
	scrollContainer = viewChild<ElementRef<HTMLElement>>('container')

	constructor(private scrollService: ScrollService) { }

	ngAfterViewInit(): void {
		this.scrollService.registerContainer(this.scrollContainer())
	}
}
