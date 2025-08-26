import { AfterViewInit, ChangeDetectionStrategy, Component, input } from '@angular/core';
import { ContentComponent } from '../../Classes/content';
import { ScrollService } from '../../Services/scroll.service';
import { ActivatedRoute, Router } from '@angular/router';
import { thread } from '../../Models/thread';

@Component({
  selector: 'app-threadchild',
  imports: [],
  templateUrl: './threadchild.component.html',
  styleUrl: './threadchild.component.scss',
  changeDetection : ChangeDetectionStrategy.OnPush,
  host : {
	'(click)' : 'threadClicked()'
  }
})
export class ThreadchildComponent extends ContentComponent<thread> implements AfterViewInit {

  constructor(private router : Router, private route : ActivatedRoute, private scrollService: ScrollService) {
    super()
  }

  threadClicked(): void {
	this.router.navigate(['threads', this.data().id],{relativeTo: this.route})
    this.scrollService.scrollBy(310)
	if(!localStorage.getItem("old")){
		localStorage.setItem("old", "yes")
	}
  }
}
