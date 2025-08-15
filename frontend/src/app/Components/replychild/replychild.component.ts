import { AfterViewInit, ChangeDetectionStrategy, Component, Input, input, output } from '@angular/core';
import { ContentComponent } from '../../Classes/content';
import { reply } from '../../Models/thread';

@Component({
	selector: 'app-replychild',
	templateUrl: './replychild.component.html',
	styleUrl: './replychild.component.scss',
	changeDetection : ChangeDetectionStrategy.OnPush
})
export class ReplychildComponent extends ContentComponent<reply> implements AfterViewInit {

	replyId = output<number>()
	selectedReply = output<{item : reply, element:HTMLElement}>()

	emitReplyId(): void {
		this.replyId.emit(this.data().id)
	}

	selectReply(item: reply, event : Event) {
		this.selectedReply.emit({item : item, element : event.target as HTMLElement})
	}

}
