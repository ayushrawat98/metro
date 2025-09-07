import { ElementRef, Injectable, signal } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { thread } from '../Models/thread';

@Injectable({
  providedIn: 'root'
})
export class InternaldataService {

  constructor() { }

  currentBoard = signal<string>('')
  currentThread = signal<number|string>(-1)
  currentTheme = signal<"light"|"dark">("light")
  currentView = signal<"clean"|"detailed">("clean")

//   showGlobalProgressBar = signal<boolean>(false)
  globalProgressBarValue = signal<number>(0)
  refreshThreadTrigger$ = new Subject<void>()
  
}
