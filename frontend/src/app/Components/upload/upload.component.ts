import { Component, ElementRef, inject, input, output, viewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ExternaldataService } from '../../Services/externaldata.service';
import { InternaldataService } from '../../Services/internaldata.service';
import { HttpEventType } from '@angular/common/http';
import { tap, last } from 'rxjs';
import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';

@Component({
	selector: 'app-upload',
	imports: [FormsModule],
	templateUrl: './upload.component.html',
	styleUrl: './upload.component.scss'
})
export class UploadComponent {

	data = inject(DIALOG_DATA);
	dialogRef = inject(DialogRef<{unsavedReplyData : string, completed : boolean}>);

	forwhat = input<string>(this.data.forwhat) //thread or reply
	replyTo = input<number>(this.data.replyTo) //required for reply
	threadId = input<string>(this.data.threadId) //required for reply
	currentBoard = input<string>(this.data.currentBoard)
	// closepopup = output<boolean>()
	// triggerRefresh = output<boolean>()
	overlay = viewChild<ElementRef>('overlay')

	replyData = this.data.unsavedReplyData
	replyFile: File | undefined | null
	fileUploadProgress = 0
	showError = false
	errorMessage = ""

	constructor(private externalData: ExternaldataService) { }

	fileSelected(event: Event) {
		this.replyFile = (event.target as HTMLInputElement).files?.item(0)
	}

	closeReplyPopup() {
		// this.closepopup.emit(true)
		this.dialogRef.close({unsavedReplyData : this.replyData,completed : false})
	}

	animateExit() {
		this.overlay()?.nativeElement.classList.add('fade-out')
		setTimeout(() => {
			this.closeReplyPopup()
		}, 300);
	}

	saveReply() {
		if (this.forwhat() == 'reply') {
			this.createReply()
		} else {
			this.createThread()
		}
	}

	timeoutref! : any
	errorHandler = (err : any) => {
		if(this.timeoutref){
			clearTimeout(this.timeoutref)
		}
		this.showError = true
		this.errorMessage = err.error
		this.timeoutref = setTimeout(() => {
			this.showError = false
			this.errorMessage = ""
		}, 2000);
	}

	createReply() {
		if (this.replyData.trim().length == 0) return;
		const body = new FormData()
		body.append('content', this.replyData.trim().slice(0, 1000).replace(/p+a+j+e+t+/gi, "paneer"))
		body.append('file', this.replyFile as Blob)
		body.append('ogfilename', this.replyFile?.name ?? "aparichit")
		body.append('replyto', String(this.replyTo()))
		body.append('boardname', this.currentBoard())
		this.externalData.postReply(body, this.threadId() ?? -1)
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
					this.animateExit()
					this.dialogRef.close({unsavedReplyData : '', completed : true})
					// this.setShowSelectedReply(false)
					this.replyFile = null
					this.replyData = ''
					this.setUserReplyList(res)
					//refresh data
					// this.triggerRefresh.emit(true)
					// this.internalData.threadSubject.next(this.currentThread)
				},
				error: this.errorHandler
			})
	}

	createThread() {
		if (this.replyData.trim().length == 0) return;
		const body = new FormData()
		body.append('content', this.replyData.trim().slice(0, 1000).replace(/p+a+j+e+t+/gi, "paneer"))
		body.append('file', this.replyFile as Blob)
		body.append('ogfilename', this.replyFile?.name ?? "aparichit")
		this.externalData.postThread(body, this.currentBoard())
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
					this.animateExit()
					this.dialogRef.close({unsavedReplyData : '' , completed : true})
					this.replyFile = null
					this.replyData = ''
					this.setUserReplyList(res)
					//refresh data\
					// this.triggerRefresh.emit(true)
					// this.internalData.boardSubject.next(this.currentBoard)
				},
				error: this.errorHandler
			})
	}

	setUserReplyList(res : any){
		let old = localStorage.getItem("replies")
		if(old){
			localStorage.setItem("replies", old + res.body.lastInsertRowid + ",")
		}else{
			localStorage.setItem("replies", res.body.lastInsertRowid + ",")
		}
	}

}
