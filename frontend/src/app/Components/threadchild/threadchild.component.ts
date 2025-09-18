import { AfterViewInit, ChangeDetectionStrategy, Component, Inject, input } from '@angular/core';
import { ContentComponent } from '../../Classes/content';
import { ScrollService } from '../../Services/scroll.service';
import { ActivatedRoute, Router } from '@angular/router';
import { thread } from '../../Models/thread';
import { FilterWordPipe } from '../../Pipes/filter-word.pipe';

@Component({
  selector: 'app-threadchild',
  imports: [FilterWordPipe],
  templateUrl: './threadchild.component.html',
  styleUrl: './threadchild.component.scss',
  changeDetection : ChangeDetectionStrategy.OnPush,
  host : {
	'(click)' : 'threadClicked()'
  }
})
export class ThreadchildComponent extends ContentComponent<thread> {

  constructor(private router : Router, private route : ActivatedRoute,@Inject('mainContainer') private scrollService: ScrollService) {
    super()
  }

  threadClicked(): void {
	this.router.navigate(['threads', this.data().id],{relativeTo: this.route})
    this.scrollService.scrollBy(300)
	// if(!localStorage.getItem("old")){
	// 	localStorage.setItem("old", "yes")
	// }
  }
}
