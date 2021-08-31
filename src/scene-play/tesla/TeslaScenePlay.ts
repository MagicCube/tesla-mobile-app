import { Easing } from '@tweenjs/tween.js';
import { ScenePlay, ScenePlayOptions } from '../ScenePlay';
import { TeslaModel3 } from './TeslaModel3';

interface TeslaScenePlayOptions extends Pick<ScenePlayOptions, 'size'> {}

export class TeslaScenePlay extends ScenePlay {
  private _model: TeslaModel3;

  constructor(canvas: HTMLCanvasElement, options: TeslaScenePlayOptions) {
    super(canvas, {
      camera: {
        position: [8, 8, 8],
        easing: Easing.Cubic.InOut,
      },
      ...options,
    });
    this._model = new TeslaModel3();
  }

  async setupScene() {
    this.scene.add(this._model);
    await this._model.load();
    this.moveCamera([
      -5.8356834892220375, 4.567450211769818, -3.4891564032644835,
    ], 6000);
  }
}
