import { Easing } from '@tweenjs/tween.js';
import { Color, Vector3 } from 'three';
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

  async setupScene() {
    this.scene.background = new Color(styles.backgroundColor);

    this.scene.add(this.model);
    await this.model.load();

    this.model.explode(0);
    this.model.assembly(6000);

    await this.panCamera(
      [-6.314698976467599, 3.1795233521232915, -5.916186446301282],
      [-0.10510654963204777, -3.6766618001426745, -0.40487639458051106],
      6000
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
