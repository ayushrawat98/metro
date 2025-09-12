import { AfterViewInit, Component, ElementRef, OnInit, viewChild } from '@angular/core';
import { BoardComponent } from "./Components/board/board.component";
import { ScrollService } from './Services/scroll.service';
import { InternaldataService } from './Services/internaldata.service';
import { FormsModule } from '@angular/forms';
import { Router, RouterOutlet } from '@angular/router';

@Component({
	selector: 'app-root',
	imports: [BoardComponent, FormsModule, RouterOutlet],
	templateUrl: './app.component.html',
	styleUrl: './app.component.scss'
})
export class AppComponent implements AfterViewInit {
	scrollContainer = viewChild<ElementRef<HTMLElement>>('container')
	

	constructor(
		private scrollService: ScrollService,
		public internalData: InternaldataService,
		public router : Router
	) { }
	
	ngOnInit(): void {
		let pastTheme = localStorage.getItem("theme")
		let pastView = localStorage.getItem("view")
		let pastReply = localStorage.getItem("simpleReply")
		if(pastTheme){
			this.internalData.currentTheme.set(pastTheme as "light" | "dark")
		}
		if(pastView){
			this.internalData.currentView.set(pastView as "clean" | "detailed")
		}
		if(pastReply){
			this.internalData.currentReply.set(pastReply == 'true' ? true : false)
		}
	}

	ngAfterViewInit(): void {
		this.scrollService.registerContainer(this.scrollContainer())
	}
}
