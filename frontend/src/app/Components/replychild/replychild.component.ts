import { AfterViewInit, Component, LOCALE_ID, output } from '@angular/core';
import { ContentComponent } from '../../Classes/content';
import { DecimalPipe } from '@angular/common';
import { reply } from '../../Models/thread';

@Component({
	selector: 'app-replychild',
	templateUrl: './replychild.component.html',
	styleUrl: './replychild.component.scss'
})
export class ReplychildComponent extends ContentComponent implements AfterViewInit {
	replyId = output<number>()
	emitReplyId(): void {
		this.replyId.emit(this.data().id)
	}

	selectedReply = output<reply>()
	selectReply(item : reply){
		this.selectedReply.emit(item)
	}

}
