import { AfterViewInit, ChangeDetectionStrategy, Component, Inject, Input, input, output } from '@angular/core';
import { ContentComponent } from '../../Classes/content';
import { reply } from '../../Models/thread';
import { ConvertLinkPipe } from '../../Pipes/convert-link.pipe';
import { RemoveSpacePipe } from '../../Pipes/remove-space.pipe';
import { ScrollService } from '../../Services/scroll.service';

@Component({
	selector: 'app-replychild',
	templateUrl: './replychild.component.html',
	styleUrl: './replychild.component.scss',
	imports : [ConvertLinkPipe, RemoveSpacePipe],
	changeDetection : ChangeDetectionStrategy.OnPush
})
export class ReplychildComponent extends ContentComponent<reply> implements AfterViewInit {

	replyId = output<number>()
	// selectedReply = output<{item : reply, element:HTMLElement}>()
	selectedReply = output<{item : number, element:HTMLElement}>()
	expandMedia = output<number>()

	// selectReply(item: reply, event : Event) {
	// 	this.selectedReply.emit({item : item, element : event.target as HTMLElement})
	// }

	constructor(
		@Inject('repliesContainer') private scrollService : ScrollService
	){
		super()
	}
	
	scrollBottom(){
		this.scrollService.scrollBottom()
	}

	selectReply(id : string|number, event : Event){
		this.selectedReply.emit({item : Number(id), element : event.target as HTMLElement})
	}

}
