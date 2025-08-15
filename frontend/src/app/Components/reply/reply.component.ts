import { AsyncPipe } from '@angular/common';
import { Component, ElementRef, OnInit, output, viewChild, viewChildren } from '@angular/core';
import { catchError, filter, interval, last, map, merge, Observable, of, startWith, Subject, switchMap, tap } from 'rxjs';
import { InternaldataService } from '../../Services/internaldata.service';
import { ReplychildComponent } from '../replychild/replychild.component';
import { FormsModule } from '@angular/forms';
import { ExternaldataService } from '../../Services/externaldata.service';
import { reply, thread } from '../../Models/thread';
import { ActivatedRoute } from '@angular/router';
import { HttpEventType } from '@angular/common/http';
import { UploadComponent } from '../upload/upload.component';
import { Dialog } from '@angular/cdk/dialog';

@Component({
	selector: 'app-reply',
	imports: [AsyncPipe, ReplychildComponent, FormsModule, UploadComponent],
	templateUrl: './reply.component.html',
	styleUrl: './reply.component.scss'
})
export class ReplyComponent implements OnInit {

	replyList$!: Observable<reply[]>
	currentThread!: string
	currentBoard!: string
	private refreshTrigger$ = new Subject<void>();

	//reply poppup related
	// showReplyPopup = false
	replyTo!: number

	constructor(
		private internalData: InternaldataService,
		private externalData: ExternaldataService,
		private route: ActivatedRoute,
		private dialog : Dialog
	) {
		this.currentBoard = this.internalData.currentBoard
	}

	ngOnInit(): void {
		this.replyList$ = merge(
			this.route.paramMap.pipe(
				map(value => value.get('threadId') ?? '-1')
			),
			this.refreshTrigger$.pipe(map(value => this.currentThread)),
			interval(15000).pipe(map(value => this.currentThread))
		).pipe(
			tap(id => this.currentThread = id),
			switchMap(id => this.externalData.getReplies(id).pipe(catchError(error => of([])))),
			map(data => this.mapFunction(data))
		)
	}


	//  ngAfterViewInit(): void {
	// 	//cant just add the class because I want staggered animation
	// 	setTimeout(() => {
	// 		this.container()?.nativeElement.classList.add('flippedIn')
	// 	}, this.index() * 60);
	// }


	mapFunction(data: reply[]): reply[] {

		let map = new Map<number, reply>()

		for (let r of data) {
			map.set(r.id, { ...r, replyList: [] })
			map.get(r.replyto)?.replyList?.push({ ...r })
		}

		let result: reply[] = []

		map.forEach(x => result.push(x))

		return result
	}

	// closePopup() {
	// 	this.setShowReplyPopup(false)
	// }

	// triggerRefresh() {
	// 	this.refreshTrigger$.next()
	// }

	// setShowReplyPopup(value: boolean) {
	// 	this.showReplyPopup = value
	// }

	createNewReply(event: number) {
		this.replyTo = event
		// if (this.replyData.length != 0) {
		//   this.replyData += '\n'
		// }
		// this.replyData += '>>' + event + '\n'
		// this.setShowReplyPopup(true)
		let dialogRef = this.dialog.open<boolean>(UploadComponent, {
			data : {
				forwhat : 'reply',
				currentBoard : this.currentBoard,
				replyTo : this.replyTo,
				threadId : this.currentThread
			}
		})

		dialogRef.closed.subscribe((res) => {
			if(res == true){
				this.refreshTrigger$.next()
			}
		})
	}

	showSelectedReply = false
	selectedReply!: reply
	setSelectedReply = (value: reply) => { this.selectedReply = value; this.setShowSelectedReply(true); console.log(this.selectedReply) }
	setShowSelectedReply = (value: boolean) => this.showSelectedReply = value

}
