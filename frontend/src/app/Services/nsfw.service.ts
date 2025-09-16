import { Injectable } from '@angular/core';
import {load} from 'nsfwjs';
import {enableDebugMode as dss} from "@tensorflow/tfjs";
dss();

@Injectable({
  providedIn: 'root'
})
export class NsfwService {
	 private model: any = null;

  async loadModel() {
    if (!this.model) {
      // loads the default model from nsfwjs CDN
      this.model = await load("/");
    }
  }

  async classifyImage(img: HTMLImageElement) {
    if (!this.model) {
      await this.loadModel();
    }
    return await this.model!.classify(img);
  }
}
