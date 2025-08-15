import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import { Component, Inject } from '@angular/core';
import { reply } from '../../Models/thread';
import { environment } from '../../../environments/environment.development';

@Component({
  selector: 'app-expandmedia',
  imports: [],
  templateUrl: './expandmedia.component.html',
  styleUrl: './expandmedia.component.scss'
})
export class ExpandmediaComponent {

	files! : reply[]
	startingPoint! : number
	serverUrl = environment.files

	constructor(
		private dialogRef : DialogRef<string>,
		@Inject(DIALOG_DATA) private dialogData : {id : number, data : reply[]}
	) {}

	ngOnInit() {
		//filter the replies with files
		this.files = this.dialogData.data.filter(x => x.file != "")
		//start point (0 based index)
		this.startingPoint = this.files.findIndex(x => x.id == this.dialogData.id)
	}

	increase(){
		if(this.startingPoint+1 < this.files.length){
			++this.startingPoint
		}
	}

	decrease(){
		if(this.startingPoint != 0){
			--this.startingPoint
		}
	}
}
