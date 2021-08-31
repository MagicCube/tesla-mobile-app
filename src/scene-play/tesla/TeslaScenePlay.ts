import { ScenePlay, ScenePlayOptions } from '../ScenePlay';
import { TeslaModel3 } from './TeslaModel3';

interface TeslaScenePlayOptions extends Pick<ScenePlayOptions, 'size'> {}

export class TeslaScenePlay extends ScenePlay {
  private _model: TeslaModel3;

  constructor(canvas: HTMLCanvasElement, options: TeslaScenePlayOptions) {
    super(canvas, { ...options });
    this._model = new TeslaModel3();
  }

  async setupScene() {
    this.scene.add(this._model);
    await this._model.load();
  }
}
