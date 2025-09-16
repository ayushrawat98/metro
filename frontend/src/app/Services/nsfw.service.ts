import { Injectable } from '@angular/core';
import * as nsfwjs from 'nsfwjs';
import * as tf from "@tensorflow/tfjs";
tf.enableProdMode();

@Injectable({
  providedIn: 'root'
})
export class NsfwService {
	 private model: nsfwjs.NSFWJS | null = null;

  async loadModel() {
    if (!this.model) {
      // loads the default model from nsfwjs CDN
      this.model = await nsfwjs.load("/");
    }
  }

  async classifyImage(img: HTMLImageElement) {
    if (!this.model) {
      await this.loadModel();
    }
    return await this.model!.classify(img);
  }
}
