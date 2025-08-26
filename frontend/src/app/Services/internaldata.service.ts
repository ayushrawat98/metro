import { ElementRef, Injectable, signal } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { thread } from '../Models/thread';

@Injectable({
  providedIn: 'root'
})
export class InternaldataService {

  constructor() { }

  currentBoard = signal<string>('b')
  currentThread = signal<number|string>(-1)
  currentTheme = signal<"light"|"dark">("light")
  
}
