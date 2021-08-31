import { Easing } from '@tweenjs/tween.js';
import { Color, Vector3 } from 'three';
import { SelectControls } from '../controls/SelectControls';

import { openingAnimationDuration } from '@/config';

import { ScenePlay, ScenePlayOptions } from '../ScenePlay';

import { TeslaModel3 } from './TeslaModel3';

import styles from '@/styles/variables.module.less';

interface TeslaScenePlayOptions extends Pick<ScenePlayOptions, 'size'> {}

export class TeslaScenePlay extends ScenePlay {
  private readonly _model: TeslaModel3;

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

  get model() {
    return this._model;
  }

  async setupScene() {
    this.scene.background = new Color(styles.backgroundColor);

    this.scene.add(this.model);
    await this.model.load();

    this.model.explode(0);
    this.model.assembly(openingAnimationDuration);

    await this.panCamera(
      [-2.0630454676789407, 3.740821669151607, -7.351070916224511],
      [0.07093096967317583, -3.8602772541774777, -0.029166030311569762],
      openingAnimationDuration
    );

    if (this.allowAnimation) {
      this.orbitControls.autoRotate = true;
    }
  }

  setupControls() {
    super.setupControls();
    const selectControls = new SelectControls(
      [this.model],
      this.camera,
      this.canvas
    );
    selectControls.addEventListener('select', () => {
      const pos = new Vector3();
      const obj = selectControls.selection!;
      obj.getWorldPosition(pos);
      console.info(obj.name, obj.position.toArray(), pos.toArray(), obj);
    });
    selectControls.activate();
  }
}
