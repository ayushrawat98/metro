import { ElementRef, Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { thread } from '../Models/thread';

@Injectable({
  providedIn: 'root'
})
export class InternaldataService {

  constructor() { }

  currentBoard = 'b'

  boardSubject = new BehaviorSubject<string>('b')
  threadSubject = new BehaviorSubject<thread | null>(null)

  setBoardSubject(value : string) : void{
    this.boardSubject.next(value)
  }

  setThreadSubject(value : thread) : void {
    this.threadSubject.next(value)
  }
}
