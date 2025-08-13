import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { reply, thread } from '../Models/thread';

@Injectable({
  providedIn: 'root'
})
export class ExternaldataService {

  url = environment.url

  constructor(private http : HttpClient) { }

  getThreads(boardName : string){
    return this.http.get<thread[]>(this.url + 'boards/' + boardName)
  }

  postThread(body : any, boardName : string){
    return this.http.post<any>(this.url + 'boards/' + boardName, body)
  }

  getReplies(threadId : string | number){
    return this.http.get<reply[]>(this.url + 'threads/' + threadId)
  }

  postReply(body : any, threadId : string | number){
    return this.http.post<any>(this.url + 'threads/' + threadId, body)
  }

}
