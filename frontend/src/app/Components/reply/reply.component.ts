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
import { Overlay, OverlayRef } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { ReplymicroComponent } from '../replymicro/replymicro.component';
import { ExpandmediaComponent } from '../expandmedia/expandmedia.component';

@Component({
	selector: 'app-reply',
	imports: [AsyncPipe, ReplychildComponent, FormsModule],
	templateUrl: './reply.component.html',
	styleUrl: './reply.component.scss'
})
export class ReplyComponent implements OnInit {

	replyList$!: Observable<reply[]>
	currentThread!: string
	currentBoard!: string
	currentReplyList! : reply[]
	totalMedia = 0
	private refreshTrigger$ = new Subject<void>();

	replyTo!: number

	constructor(
		private internalData: InternaldataService,
		private externalData: ExternaldataService,
		private route: ActivatedRoute,
		private dialog: Dialog,
		private overlay: Overlay
	) {
		this.currentBoard = this.internalData.currentBoard
	}

	ngOnInit(): void {
		this.replyList$ = merge(
			this.route.paramMap.pipe(
				map(value => value.get('threadId') ?? '-1')
			),
			this.refreshTrigger$.pipe(map(value => this.currentThread)),
			interval(60000).pipe(map(value => this.currentThread))
		).pipe(
			tap(id => this.currentThread = id),
			switchMap(id => this.externalData.getReplies(id).pipe(catchError(error => of([])))),
			map(data => this.mapFunction(data)),
			tap(data => this.currentReplyList = data)
		)
	}

	mapFunction(data: reply[]): reply[] {
		if(data.length == 0) return []

		let map = new Map<number, reply>()

		for (let r of data) {
			map.set(r.id, { ...r, replyList: [] })
			map.get(r.replyto)?.replyList?.push({ ...r })
		}

		for (let r of data) {
			let reply = map.get(r.replyto)
			// if(reply){
			let clone : reply = Object.assign({}, reply)
			delete clone['replyList']
			map.get(r.id)?.replyList?.unshift(clone)
			// }
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

		let dialogRef = this.dialog.open<boolean>(UploadComponent, {
			data: {
				forwhat: 'reply',
				currentBoard: this.currentBoard,
				replyTo: this.replyTo,
				threadId: this.currentThread
			},
			autoFocus : false,
			restoreFocus : false
		})

		dialogRef.closed.subscribe((res) => {
			if (res == true) {
				this.refreshTrigger$.next()
			}
		})
	}

	overlayRef!: OverlayRef
	setSelectedReply(replyData: { item: reply, element: HTMLElement }) {
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
		componentRef.instance.data = replyData.item;
		componentRef.instance.index = -1

		// If ReplyChildComponent has outputs, you can subscribe here
		componentRef.instance.replyId.subscribe((id: number) => {
			this.createNewReply(id)
		});
	}

	expandMedia(id : number){
		let dialogRef = this.dialog.open<string>(ExpandmediaComponent, {
			data: {
				id : id,
				data : this.currentReplyList
			},
			autoFocus : false,
			restoreFocus : false
		})
	}
}
