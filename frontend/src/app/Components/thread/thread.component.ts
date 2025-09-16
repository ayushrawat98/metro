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
import { SortThreadPipe } from '../../Pipes/sort-thread.pipe';
import { BoardFlipComponent } from '../board-flip/board-flip.component';

@Component({
	selector: 'app-thread',
	imports: [AsyncPipe, ThreadchildComponent, FormsModule, SortThreadPipe, BoardFlipComponent],
	templateUrl: './thread.component.html',
	styleUrl: './thread.component.scss',
	host : {
		'tabIndex' : '-1'
	}
})
export class ThreadComponent implements OnInit {

	threadList$!: Observable<thread[]>
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
				map(value => value.get('boardName') ?? '')
			),
			this.refreshTrigger$.pipe(map(value => this.internalData.currentBoard())),
			interval(60000).pipe(map(value => this.internalData.currentBoard()))
		).pipe(
			tap(board => {
				this.internalData.currentBoard.set(board)
			}
			),
			switchMap(board =>
				this.externalData.getThreads(board).pipe(
					catchError(error => of([]))
				)
			)
		)

	}
	
	showThreadPopup() {
		const dialogRef = this.dialog.open<dialogReturnData>(UploadComponent, {
			data : {
				forwhat : 'thread',
				currentBoard : this.internalData.currentBoard()
			},
			autoFocus : false,
			restoreFocus : false
		})

		dialogRef.closed.subscribe((res)=>{
			//if closed after adding a new post
			if(res?.completed == true){
				this.refreshTrigger$.next()
			}
		})
	}

	
	
}


type dialogReturnData = {
	unsavedReplyData: string,
	completed: boolean
}