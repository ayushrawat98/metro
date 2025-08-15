import { Component, Input, output } from '@angular/core';
import { reply } from '../../Models/thread';
import { environment } from '../../../environments/environment.development';


@Component({
  selector: 'app-replymicro',
  imports: [],
  templateUrl: './replymicro.component.html',
  styleUrl: './replymicro.component.scss'
})
export class ReplymicroComponent {
	@Input() data! : reply
	@Input() index! : number
	fileUrl = environment.files
	replyId = output<number>()

	emitReplyId(): void {
		this.replyId.emit(this.data.id)
	}
}
