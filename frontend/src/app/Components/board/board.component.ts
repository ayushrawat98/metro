import { Component, output } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { InternaldataService } from '../../Services/internaldata.service';
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
    // this.internalData.setBoardSubject(value)
	this.router.navigate(['boards', value])
    this.scrollService.scrollBy(300)
  }
}
