import { Component, output } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { ScrollService } from '../../Services/scroll.service';

@Component({
  selector: 'app-board',
  imports: [],
  templateUrl: './board.component.html',
  styleUrl: './board.component.scss'
})
export class BoardComponent {
  boards = ['b', 'fit', 'fa', 'g', 'art', 'music', 'movies']

  constructor(private scrollService : ScrollService, private router : Router){}
  
  boardChanged(value : string){
	this.router.navigate(['boards', value])
    this.scrollService.scrollBy(300)
  }
}
