import { AfterViewInit, ChangeDetectionStrategy, Component, LOCALE_ID, output } from '@angular/core';
import { ContentComponent } from '../../Classes/content';
import { DecimalPipe } from '@angular/common';
import { reply } from '../../Models/thread';

@Component({
	selector: 'app-replychild',
	templateUrl: './replychild.component.html',
	styleUrl: './replychild.component.scss',
	changeDetection : ChangeDetectionStrategy.OnPush
})
export class ReplychildComponent extends ContentComponent implements AfterViewInit {

	replyId = output<number>()
	selectedReply = output<reply>()

	emitReplyId(): void {
		this.replyId.emit(this.data().id)
	}

	selectReply(item: reply) {
		this.selectedReply.emit(item)
	}

}
