import { AfterViewInit, ChangeDetectionStrategy, Component, input } from '@angular/core';
import { ContentComponent } from '../../Classes/content';
import { ScrollService } from '../../Services/scroll.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-threadchild',
  imports: [],
  templateUrl: './threadchild.component.html',
  styleUrl: './threadchild.component.scss',
  changeDetection : ChangeDetectionStrategy.OnPush
})
export class ThreadchildComponent extends ContentComponent implements AfterViewInit {

  constructor(private router : Router, private route : ActivatedRoute, private scrollService: ScrollService) {
    super()
  }

  threadClicked(): void {
	this.router.navigate(['threads', this.data().id],{relativeTo: this.route})
    this.scrollService.scrollBy(300)
  }
}
