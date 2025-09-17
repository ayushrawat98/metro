import { AfterViewInit, Component, ElementRef, inject, OnInit, viewChild } from '@angular/core';
import { BoardComponent } from "./Components/board/board.component";
import { ScrollService } from './Services/scroll.service';
import { InternaldataService } from './Services/internaldata.service';
import { FormsModule } from '@angular/forms';
import { Router, RouterOutlet } from '@angular/router';

@Component({
	selector: 'app-root',
	imports: [RouterOutlet],
	templateUrl: './app.component.html',
	styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
	internalData = inject(InternaldataService)
	ngOnInit(): void {
		let pastTheme = localStorage.getItem("darkTheme")
		if(pastTheme){
			this.internalData.darkTheme.set(pastTheme == 'true' ? true : false)
		}
	}
}
