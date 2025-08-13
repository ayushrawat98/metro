import { AfterViewInit, Component, input } from '@angular/core';
import { ContentComponent } from '../../Classes/content';
import { ScrollService } from '../../Services/scroll.service';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-threadchild',
  imports: [],
  templateUrl: './threadchild.component.html',
  styleUrl: './threadchild.component.scss'
})
export class ThreadchildComponent extends ContentComponent implements AfterViewInit {

  constructor(private router : Router, private route : ActivatedRoute, private scrollService: ScrollService) {
    super()
  }

  threadChanged(): void {
    // this.internalData.threadSubject.next(value)
	this.router.navigate(['threads', this.data().id],{relativeTo: this.route})
    this.scrollService.scrollBy(300)
  }
}
