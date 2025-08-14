import { Directive, ElementRef, input, viewChild } from '@angular/core';
import { environment } from '../../environments/environment.development';

@Directive()
export abstract class ContentComponent {
	data = input.required<any>()
	index = input.required<number>()
	container = viewChild<ElementRef>('container')
	fileUrl = environment.files

	ngAfterViewInit(): void {
		//cant just add the class because I want staggered animation
		setTimeout(() => {
			this.container()?.nativeElement.classList.add('flippedIn')
		}, this.index() * 60);
	}

}