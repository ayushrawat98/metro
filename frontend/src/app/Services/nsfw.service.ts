import { Injectable } from '@angular/core';
import * as nsfwjs from 'nsfwjs';

@Injectable({
  providedIn: 'root'
})
export class NsfwService {
	 private model: nsfwjs.NSFWJS | null = null;

  async loadModel() {
    if (!this.model) {
      // loads the default model from nsfwjs CDN
      this.model = await nsfwjs.load("MobileNetV2");
    }
  }

  async classifyImage(img: HTMLImageElement) {
    if (!this.model) {
      await this.loadModel();
    }
    return await this.model!.classify(img);
  }
}
