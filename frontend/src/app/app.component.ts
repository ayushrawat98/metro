import { AfterViewInit, Component, ElementRef, OnInit, viewChild } from '@angular/core';
import { BoardComponent } from "./Components/board/board.component";
import { ScrollService } from './Services/scroll.service';
import { InternaldataService } from './Services/internaldata.service';
import { FormsModule } from '@angular/forms';
import { ExternaldataService } from './Services/externaldata.service';
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
	

	constructor(private scrollService: ScrollService, private internalData: InternaldataService, private externalData: ExternaldataService) { }
	

	ngAfterViewInit(): void {
		this.scrollService.registerContainer(this.scrollContainer())
	}

	colorMode = 'light'
	changeColorMode(mode : string){
		this.colorMode = mode
		// document.body.classList.add(this.colorMode == 'dark' ? 'darkMode' : '');
	}
}
