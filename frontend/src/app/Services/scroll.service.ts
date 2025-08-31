import { ElementRef, Injectable } from '@angular/core';

@Injectable({
	providedIn: 'root'
})
export class ScrollService {

	constructor() { }

	private scrollContainer?: ElementRef<HTMLElement>;

	registerContainer(container: ElementRef<HTMLElement> | undefined) {
		this.scrollContainer = container;
	}

	scrollBy(offset: number) {
		if (!this.scrollContainer) return;
		this.scrollContainer.nativeElement.scrollBy({
			left: offset,
			behavior: 'smooth'
		});
	}

	scrollToStart() {
		this.scrollContainer?.nativeElement.scrollTo({ left: 0, behavior: 'smooth' });
	}

	scrollToEnd() {
		const el = this.scrollContainer?.nativeElement;
		if (el) {
			el.scrollTo({ left: el.scrollWidth, behavior: 'smooth' });
		}
	}

	scrollBottom() {
		this.scrollContainer?.nativeElement.scrollTo({
			top: this.scrollContainer?.nativeElement.scrollHeight,
			behavior: "smooth"
		});
	}

	scrollUp() {
		this.scrollContainer?.nativeElement.scrollTo({
			top: 0,
			behavior: "smooth"
		});
	}
}
