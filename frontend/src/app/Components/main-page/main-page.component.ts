import { AfterViewInit, Component, ElementRef, inject, viewChild } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { InternaldataService } from '../../Services/internaldata.service';
import { ScrollService } from '../../Services/scroll.service';
import { BoardComponent } from '../board/board.component';

@Component({
  selector: 'app-main-page',
  imports: [BoardComponent, RouterOutlet],
  templateUrl: './main-page.component.html',
  styleUrl: './main-page.component.scss'
})
export class MainPageComponent implements AfterViewInit {
	scrollContainer = viewChild<ElementRef<HTMLElement>>('container')
	
	scrollService = inject(ScrollService)
	internalData = inject(InternaldataService)
	router = inject(Router)

	ngAfterViewInit(): void {
		this.scrollService.registerContainer(this.scrollContainer())
	}
}
