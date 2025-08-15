import { AsyncPipe } from '@angular/common';
import { Component, ElementRef, inject, OnInit, output, viewChild } from '@angular/core';
import { catchError, filter, interval, last, map, merge, Observable, of, startWith, Subject, switchMap, tap } from 'rxjs';
import { InternaldataService } from '../../Services/internaldata.service';
import { ThreadchildComponent } from '../threadchild/threadchild.component';
import { ExternaldataService } from '../../Services/externaldata.service';
import { FormsModule } from '@angular/forms';
import { thread } from '../../Models/thread';
import { ActivatedRoute } from '@angular/router';
import { UploadComponent } from '../upload/upload.component';
import {Dialog} from '@angular/cdk/dialog';

@Component({
	selector: 'app-thread',
	imports: [AsyncPipe, ThreadchildComponent, FormsModule],
	templateUrl: './thread.component.html',
	styleUrl: './thread.component.scss'
})
export class ThreadComponent implements OnInit {

	threadList$!: Observable<thread[]>
	currentBoard!: string
	private refreshTrigger$ = new Subject<void>();

	//create thread popup
	
	// showThreadPopup = false
	
	constructor(
		private internalData: InternaldataService,
		private externalData: ExternaldataService,
		private route: ActivatedRoute,
		private dialog : Dialog
	) { }

	ngOnInit(): void {
		this.threadList$ = merge(
			this.route.paramMap.pipe(
				map(value => value.get('boardName') ?? 'noboard')
			),
			this.refreshTrigger$.pipe(map(value => this.currentBoard)),
			interval(15000).pipe(map(value => this.currentBoard))
		).pipe(
			tap(board => {
				this.currentBoard = board
				this.internalData.currentBoard = board
			}
			),
			switchMap(board =>
				this.externalData.getThreads(board).pipe(
					catchError(error => of([]))
				)
			)
		)

	}


	// showForm() {
	//   if (this.flipOut.every(x => x == false)) {
	//     this.scrollContainer = this.internalData.threadScrollContainer
	//     let elementskipped = Math.trunc(((this.scrollContainer?.nativeElement.scrollTop ?? 0) + 96) / 124) - 1
	//     for (let i = elementskipped; i < elementskipped + 8; ++i) {
	//       setTimeout(() => {
	//         this.flipOut[i] = true
	//       }, 50 * (i + 1 - elementskipped));
	//     }
	//     setTimeout(() => {
	//       this.showCreateThreadForm = true
	//     }, 600);
	//   } else {
	//     this.flipOut = Array(50).fill(false)
	//     this.showCreateThreadForm = false
	//   }
	// }

	// closePopup(){
	// 	this.setShowThreadPopup(false)
	// }

	// triggerRefresh(){
	// 	this.refreshTrigger$.next()
	// }

	
	showThreadPopup() {
		const dialogRef = this.dialog.open<boolean>(UploadComponent, {
			data : {
				forwhat : 'thread',
				currentBoard : this.currentBoard
			}
		})

		dialogRef.closed.subscribe((res)=>{
			//if closed after adding a new post
			if(res == true){
				this.refreshTrigger$.next()
			}
		})
	}

	
	
}
