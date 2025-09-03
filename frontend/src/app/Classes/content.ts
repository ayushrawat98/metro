import { Directive, ElementRef, input, viewChild } from '@angular/core';
import { environment } from '../../environments/environment.development';

@Directive()
export abstract class ContentComponent<T> {
	data = input.required<T>()
	index = input.required<number>()
	container = viewChild<ElementRef>('container')
	fileUrl = environment.files

	ngAfterViewInit(): void {
		//cant just add the class because I want staggered animation
		if (this.index() < 8) {
			setTimeout(() => {
				this.container()?.nativeElement.classList.add('flippedIn')
			}, this.index() * 60);
		} else {
			this.container()?.nativeElement.classList.add('flippedIn')
		}

	}

}