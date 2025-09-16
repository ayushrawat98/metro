import { Component, ElementRef, inject, input, output, viewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ExternaldataService } from '../../Services/externaldata.service';
import { InternaldataService } from '../../Services/internaldata.service';
import { HttpEventType } from '@angular/common/http';
import { tap, last, map, throwError, of, mergeMap } from 'rxjs';
import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import { NsfwService } from '../../Services/nsfw.service';

@Component({
	selector: 'app-upload',
	imports: [FormsModule],
	templateUrl: './upload.component.html',
	styleUrl: './upload.component.scss'
})
export class UploadComponent {

	data = inject(DIALOG_DATA);
	dialogRef = inject(DialogRef<{ unsavedReplyData: string, completed: boolean }>);

	forwhat = input<string>(this.data.forwhat) //thread or reply
	replyTo = input<number>(this.data.replyTo) //required for reply
	threadId = input<string>(this.data.threadId) //required for reply
	currentBoard = input<string>(this.data.currentBoard)
	// closepopup = output<boolean>()
	// triggerRefresh = output<boolean>()
	overlay = viewChild<ElementRef>('overlay')

	replyData = this.data.unsavedReplyData ?? ''
	replyFile: File | undefined | null
	fileUploadProgress = 0
	showError = false
	errorMessage = ""

	constructor(private externalData: ExternaldataService, public internalData: InternaldataService, private nsfw : NsfwService) { }

	fileSelected(event: Event) {
		this.replyFile = (event.target as HTMLInputElement).files?.item(0)
	}

	closeReplyPopup() {
		// this.closepopup.emit(true)
		this.dialogRef.close({ unsavedReplyData: this.replyData, completed: false })
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

	timeoutref!: any
	errorHandler = (err: any) => {
		if (this.timeoutref) {
			clearTimeout(this.timeoutref)
		}
		this.showError = true
		this.errorMessage = err.error
		this.timeoutref = setTimeout(() => {
			this.showError = false
			this.errorMessage = ""
		}, 3000);
	}

	checkImage(){
		if(this.replyFile && this.replyFile.type.startsWith('image')){
			const img = new Image();
			img.src = URL.createObjectURL(this.replyFile as Blob);

			img.onload = async () => {
				this.errorHandler("Please wait ... loading ...")
				const predictions = await this.nsfw.classifyImage(img);
				const interested = predictions.filter(x => x.className == 'Hentai' || x.className == 'Porn')
				if(interested[0].probability > 0.70 || interested[1].probability > 0.70){
					this.replyFile = null
				}else{
					this.saveReply()
				}
				// cleanup memory
				URL.revokeObjectURL(img.src);
			};
		}
	}

	createReply() {
		if (this.replyData.trim().length == 0) {
			this.showErrorMessage("Post cannot be empty")
			return
		} else if (this.replyFile && this.replyFile?.size > 5000000) {
			this.showErrorMessage("File size should be less than 5 MB")
			return
		}
		const body = new FormData()
		body.append('content', this.replyData.trim().slice(0, 420))
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
					this.dialogRef.close({ unsavedReplyData: '', completed: true })
					this.replyFile = null
					this.replyData = ''
					this.setUserReplyList(res)
				},
				error: this.errorHandler
			})
	}

	showErrorMessage(msg: string) {
		if (this.timeoutref) {
			clearTimeout(this.timeoutref)
		}
		this.showError = true
		this.errorMessage = msg
		this.timeoutref = setTimeout(() => {
			this.showError = false
			this.errorMessage = ""
		}, 2000);
	}

	createThread() {
		if (this.replyData.trim().length == 0) {
			this.showErrorMessage("Thread cannot be empty")
			return
		} else if (!this.replyFile) {
			this.showErrorMessage("File is required")
			return
		} else if (this.replyFile && this.replyFile?.size > 5000000) {
			this.showErrorMessage("File size should be less than 5 MB")
			return
		}
		const body = new FormData()
		body.append('content', this.replyData.trim().slice(0, 420))
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
					this.dialogRef.close({ unsavedReplyData: '', completed: true })
					this.replyFile = null
					this.replyData = ''
					this.setUserReplyList(res)
				},
				error: this.errorHandler
			})
	}

	setUserReplyList(res: any) {
		let old = localStorage.getItem("replies")
		if (old) {
			localStorage.setItem("replies", old + res.body.lastInsertRowid + ",")
		} else {
			localStorage.setItem("replies", res.body.lastInsertRowid + ",")
		}
	}

}
