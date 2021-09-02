import { Easing } from '@tweenjs/tween.js';
import { Color, Vector3 } from 'three';

import { openingAnimationDuration } from '@/config';

import { SelectControls } from '../controls/SelectControls';

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

  protected async setupScene() {
    this.scene.background = new Color(styles.backgroundColor);

    this.scene.add(this.model);
    await this.model.load((progress) => {
      this.dispatchEvent({ type: 'progress', ...progress });
    });

    this.dispatchEvent({ type: 'load' });

    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    this.playOpeningAnimation();
  }

  protected setupControls() {
    super.setupControls();
    this.orbitControls.autoRotateSpeed *= -1;
    const selectControls = new SelectControls(
      [this.model],
      this.camera,
      this.canvas
    );
    selectControls.addEventListener('select', () => {
      if (selectControls.selection) {
        const obj = selectControls.selection;
        const pos = new Vector3();
        obj.getWorldPosition(pos);
        // eslint-disable-next-line no-console
        console.info(obj.name, obj.position.toArray(), pos.toArray(), obj);
      }
    });
    selectControls.activate();
  }

  async playOpeningAnimation() {
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    this.model.explode(0);
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
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
}
