import { AfterViewInit, Component, ElementRef, OnInit, viewChild } from '@angular/core';
import { BoardComponent } from "./Components/board/board.component";
import { ScrollService } from './Services/scroll.service';
import { InternaldataService } from './Services/internaldata.service';
import { FormsModule } from '@angular/forms';
import { RouterOutlet } from '@angular/router';

@Component({
	selector: 'app-root',
	imports: [BoardComponent, FormsModule, RouterOutlet],
	templateUrl: './app.component.html',
	styleUrl: './app.component.scss'
})
export class AppComponent implements AfterViewInit {
	title = 'metro';
	scrollContainer = viewChild<ElementRef<HTMLElement>>('container')
	

	constructor(
		private scrollService: ScrollService,
		public internalData: InternaldataService,
	) { }
	
	ngOnInit(): void {
		let pastTheme = localStorage.getItem("theme")
		if(pastTheme){
			this.internalData.currentTheme.set(pastTheme as "light" | "dark")
		}
	}

	ngAfterViewInit(): void {
		this.scrollService.registerContainer(this.scrollContainer())
		//if old visitor , auto scroll to right
		if(localStorage.getItem("old")){
			this.scrollService.scrollBy(300)
		}
	}
}
