import { AsyncPipe } from '@angular/common';
import { Component, ElementRef, Inject, OnInit, output, Signal, viewChild, viewChildren } from '@angular/core';
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
import { Overlay, OverlayRef } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { ReplymicroComponent } from '../replymicro/replymicro.component';
import { ExpandmediaComponent } from '../expandmedia/expandmedia.component';
import { ScrollService } from '../../Services/scroll.service';

@Component({
	selector: 'app-reply',
	imports: [AsyncPipe, ReplychildComponent, FormsModule],
	templateUrl: './reply.component.html',
	styleUrl: './reply.component.scss'
})
export class ReplyComponent implements OnInit {

	replyList$!: Observable<reply[]>
	currentReplyList!: reply[]
	totalMedia = 0
	private refreshTrigger$ = new Subject<void>();

	replyTo!: number

	constructor(
		public internalData: InternaldataService,
		private externalData: ExternaldataService,
		private route: ActivatedRoute,
		private dialog: Dialog,
		private overlay: Overlay,
		@Inject('repliesContainer') private scrollService : ScrollService,
		@Inject('mainContainer') private scrollService2 : ScrollService
	) {}

	ngOnInit(): void {
		this.replyList$ = merge(
			this.route.paramMap.pipe(
				map(value => value.get('threadId') ?? '-1')
			),
			this.refreshTrigger$.pipe(map(value => this.internalData.currentThread())),
			interval(60000).pipe(map(value => this.internalData.currentThread()))
		).pipe(
			tap(id => { 
				this.internalData.currentThread.set(id)
				this.scrollService2.scrollBy(300)
			}),
			switchMap(id => this.externalData.getReplies(id).pipe(catchError(error => of([])))),
			// map(data => this.mapFunction(data)),
			tap(data => this.currentReplyList = data)
		)
	}


	mapFunction(data: reply[]): reply[] {
		let regex = />>([0-9]+)/g
		let converted = data.map(x => {
			let replyto = []
			for (let a of x.content.matchAll(regex)) {
				replyto.push(Number(a[1]))
			}
			return { ...x, repliedTo: Array.from(new Set(replyto)) }
		})

		for (let a of converted) {
			for (let b of a.repliedTo) {
				let temp = converted.find(x => x.id == b)
				if (temp) {
					if (temp.repliesFrom) {
						temp.repliesFrom.push(a.id)
					} else {
						temp.repliesFrom = [a.id]
					}
				}
			}
		}
		return converted
	}

	// mapFunction(data: reply[]): reply[] {
	// 	if(data.length == 0) return []

	// 	let map = new Map<number, reply>()

	// 	for (let r of data) {
	// 		map.set(r.id, { ...r, replyList: [] })
	// 		map.get(r.replyto)?.replyList?.push({ ...r })
	// 	}

	// 	for (let r of data) {
	// 		let reply = map.get(r.replyto)
	// 		// if(reply){
	// 		let clone : reply = Object.assign({}, reply)
	// 		delete clone['replyList']
	// 		map.get(r.id)?.replyList?.unshift(clone)
	// 		// }
	// 	}

	// 	let result: reply[] = []

	// 	map.forEach(x => result.push(x))

	// 	return result
	// }

	unsavedReplyData = ''
	createNewReply(event: number) {
		this.replyTo = event

		if (this.unsavedReplyData.length == 0) {
			this.unsavedReplyData = ">>" + this.replyTo + "\n"
		} else if (this.unsavedReplyData.charAt(this.unsavedReplyData.length - 1) == '\n') {
			this.unsavedReplyData += ">>" + this.replyTo + "\n"
		}
		else {
			this.unsavedReplyData += "\n>>" + this.replyTo + "\n"
		}

		let dialogRef = this.dialog.open<dialogReturnData>(UploadComponent, {
			data: {
				forwhat: 'reply',
				currentBoard: this.internalData.currentBoard(),
				replyTo: this.replyTo,
				threadId: this.internalData.currentThread(),
				unsavedReplyData: this.unsavedReplyData
			},
			autoFocus: false,
			restoreFocus: false,
			disableClose : true
		})

		dialogRef.closed.subscribe((res) => {
			if (res?.completed == true) {
				this.refreshTrigger$.next()
				this.unsavedReplyData = ''
			} else {
				this.unsavedReplyData = res?.unsavedReplyData ?? ''
			}
		})
	}

	overlayRef!: OverlayRef
	setSelectedReply(replyData: { item: number, element: HTMLElement }) {
		// Close any existing overlay
		if (this.overlayRef) {
			this.overlayRef.dispose();
		}

		const positionStrategy = this.overlay.position()
			.flexibleConnectedTo(replyData.element)   // position relative to clicked element
			.withPositions([
				{
					originX: 'start',
					originY: 'bottom',   // overlay appears below the origin
					overlayX: 'center',
					overlayY: 'top'
				},
				{
					originX: 'start',    // fallback if not enough space
					originY: 'top',
					overlayX: 'start',
					overlayY: 'bottom'
				}
			])
			.withFlexibleDimensions(true)  // keeps overlay size fixed
			.withPush(true);

		this.overlayRef = this.overlay.create({
			positionStrategy: positionStrategy,
			hasBackdrop: true,
			backdropClass: 'custom-overlay-backdrop',
		});

		this.overlayRef.backdropClick().subscribe(() => this.overlayRef.dispose());

		const portal = new ComponentPortal(ReplymicroComponent);
		const componentRef = this.overlayRef.attach(portal);

		// Pass data into the overlayed ReplyChildComponent
		componentRef.instance.data = this.currentReplyList.filter(x => x.id == replyData.item)[0];
		componentRef.instance.index = -1

		// If ReplyChildComponent has outputs, you can subscribe here
		componentRef.instance.replyId.subscribe((id: number) => {
			this.createNewReply(id)
		});
	}

	expandMedia(id: number) {
		let dialogRef = this.dialog.open<string>(ExpandmediaComponent, {
			data: {
				id: id,
				data: this.currentReplyList
			},
			autoFocus: false,
			restoreFocus: false
		})
	}


	scrollDown = true
	scroll(){
		if(this.scrollDown){
			this.scrollService.scrollBottom()
		}else{
			this.scrollService.scrollUp()
		}
		this.scrollDown = !this.scrollDown
	}
}


type dialogReturnData = {
	unsavedReplyData: string,
	completed: boolean
}