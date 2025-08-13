import { AsyncPipe } from '@angular/common';
import { Component, ElementRef, OnInit, output, viewChild } from '@angular/core';
import { catchError, filter, interval, map, merge, Observable, of, startWith, Subject, switchMap, tap } from 'rxjs';
import { InternaldataService } from '../../Services/internaldata.service';
import { ThreadchildComponent } from '../threadchild/threadchild.component';
import { ExternaldataService } from '../../Services/externaldata.service';
import { FormsModule } from '@angular/forms';
import { thread } from '../../Models/thread';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-thread',
  imports: [AsyncPipe, ThreadchildComponent, FormsModule],
  templateUrl: './thread.component.html',
  styleUrl: './thread.component.scss'
})
export class ThreadComponent implements OnInit {

  threadList$!: Observable<thread[]>
  currentBoard! : string
  private refreshTrigger$ = new Subject<void>();

  //create thread popup
  overlay = viewChild<ElementRef>('overlay')
  showThreadPopup = false
  threadData = ''
  threadFile: File | undefined | null

  constructor(private internalData: InternaldataService, private externalData: ExternaldataService, private route : ActivatedRoute) { }

  ngOnInit(): void {
    // this.threadList$ = this.internalData.boardSubject.pipe(
    //   tap(board => this.currentBoard = board),
    //   switchMap(board => interval(10000).pipe(startWith(board), switchMap(board => this.externalData.getThreads(this.currentBoard).pipe(catchError(error => of([]))))))
    // )

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

  setShowThreadPopup(value: boolean) {
    this.showThreadPopup = value
  }

  closeThreadPopup() {
    this.overlay()?.nativeElement.classList.add('fade-out')
    setTimeout(() => {
      this.setShowThreadPopup(false)
    }, 300);
  }

  fileSelected(event: Event, index: number) {
    this.threadFile = (event.target as HTMLInputElement).files?.item(0)
    console.log(this.threadFile)
  }

  createThread(){
	if(this.threadData.trim().length == 0) return;
    const body = new FormData()
    body.append('content', this.threadData)
    body.append('file', this.threadFile as Blob)
    this.externalData.postThread(body, this.currentBoard).subscribe({
      next : (res) =>{
        //reset data
        this.closeThreadPopup()
        this.threadFile = null
        this.threadData = ''
        //refresh data\
		this.refreshTrigger$.next()
        // this.internalData.boardSubject.next(this.currentBoard)
      },
      error : (err) => {

      }
    })
  }

}
