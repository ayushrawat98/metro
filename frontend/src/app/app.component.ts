import { AfterViewInit, Component, ElementRef, OnInit, viewChild } from '@angular/core';
import { BoardComponent } from "./Components/board/board.component";
import { ScrollService } from './Services/scroll.service';
import { InternaldataService } from './Services/internaldata.service';
import { FormsModule } from '@angular/forms';
import { Router, RouterOutlet } from '@angular/router';
import { NsfwService } from './Services/nsfw.service';

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
		public router : Router,
		private nsfw : NsfwService
	) { }
	
	ngOnInit(): void {
		let pastTheme = localStorage.getItem("darkTheme")
		if(pastTheme){
			this.internalData.darkTheme.set(pastTheme == 'true' ? true : false)
		}
		this.nsfw.loadModel()
	}

	ngAfterViewInit(): void {
		this.scrollService.registerContainer(this.scrollContainer())
	}
}
