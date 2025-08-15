import { AsyncPipe } from '@angular/common';
import {  Component, ElementRef, OnInit, output, viewChild, viewChildren } from '@angular/core';
import { catchError, filter, interval, last, map, merge, Observable, of, startWith, Subject, switchMap, tap } from 'rxjs';
import { InternaldataService } from '../../Services/internaldata.service';
import { ReplychildComponent } from '../replychild/replychild.component';
import { FormsModule } from '@angular/forms';
import { ExternaldataService } from '../../Services/externaldata.service';
import { reply, thread } from '../../Models/thread';
import { ActivatedRoute } from '@angular/router';
import { HttpEventType } from '@angular/common/http';

@Component({
	selector: 'app-reply',
	imports: [AsyncPipe, ReplychildComponent, FormsModule],
	templateUrl: './reply.component.html',
	styleUrl: './reply.component.scss'
})
export class ReplyComponent implements OnInit {

	replyList$!: Observable<reply[]>
	currentThread!: string
	private refreshTrigger$ = new Subject<void>();

	//reply poppup related
	showReplyPopup = false
	replyData = ''
	replyFile: File | undefined | null
	overlay = viewChild<ElementRef>('overlay')
	replyTo!: number
	fileUploadProgress = 0

	constructor(private internalData: InternaldataService, private externalData: ExternaldataService, private route : ActivatedRoute) { }

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
			map.set(r.id, {...r, replyList : []})
			map.get(r.replyto)?.replyList?.push({...r})
		}

		let result : reply[] = []

		map.forEach(x => result.push(x))

		return result
	}


	setShowReplyPopup(value: boolean) {
		this.showReplyPopup = value
	}

	closeReplyPopup() {
		this.overlay()?.nativeElement.classList.add('fade-out')
		setTimeout(() => {
			this.setShowReplyPopup(false)
		}, 300);
	}

	createNewReply(event: number) {
		this.replyTo = event
		// if (this.replyData.length != 0) {
		//   this.replyData += '\n'
		// }
		// this.replyData += '>>' + event + '\n'
		this.setShowReplyPopup(true)
	}

	fileSelected(event: Event) {
		let file = (event.target as HTMLInputElement).files?.item(0)
		this.replyFile = file
	}

	saveReply() {
		if(this.replyData.trim().length == 0) return;
		const body = new FormData()
		body.append('content', this.replyData.trim().slice(0,1000))
		body.append('file', this.replyFile as Blob)
		body.append('replyto', this.replyTo.toString())
		body.append('boardname' , this.internalData.currentBoard)
		this.externalData.postReply(body, this.currentThread)
		.pipe(
				tap(event => {
					if (event.type == HttpEventType.UploadProgress) {
						this.fileUploadProgress = Math.round(100 * event.loaded / (event.total ?? 1));
					}
					else if (event.type === HttpEventType.Response) {
						this.fileUploadProgress = 0
					}
				}),
				last()
			)
		.subscribe({
			next: (res) => {
				//reset data
				this.closeReplyPopup()
				this.setShowSelectedReply(false)
				this.replyFile = null
				this.replyData = ''
				//refresh data
				this.refreshTrigger$.next()
				// this.internalData.threadSubject.next(this.currentThread)
			},
			error: (err) => {

			}
		})
	}

	showSelectedReply = false
	selectedReply! : reply
	setSelectedReply = (value : reply) => {this.selectedReply = value;this.setShowSelectedReply(true); console.log(this.selectedReply)}
	setShowSelectedReply = (value : boolean) => this.showSelectedReply = value

}
