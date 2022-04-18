import { Easing } from '@tweenjs/tween.js';
import { Color, Vector3, Vector3Tuple } from 'three';

import { openingAnimationDuration } from '@/config';

import { SelectControls, SelectEvent } from '../controls/SelectControls';

import { ScenePlay, ScenePlayOptions } from '../ScenePlay';

import { TeslaModel3 } from './TeslaModel3';

import styles from '@/styles/variables.module.less';

interface TeslaScenePlayOptions extends Pick<ScenePlayOptions, 'size'> {}

export const namedViews: Record<
  'default' | 'home' | 'top' | 'side' | 'climate' | 'interior',
  [Vector3Tuple, Vector3Tuple, Vector3Tuple?, Vector3Tuple?]
> = {
  default: [
    [-5.1092359402557825, 2.3585518996952866, -5.686206208293889],
    [0, 0, 0],
  ],
  home: [
    [-2.0630454676789407, 3.740821669151607, -7.351070916224511],
    [0.07093096967317583, -3.8602772541774777, -0.029166030311569762],
  ],
  top: [
    [0, 4.5, 0],
    [0, 0, 0],
  ],
  side: [
    [-8.5, 0, 0],
    [0, 0, 0],
  ],
  climate: [
    [2.7578341026618327e-9, 4, 1.1888649873971757],
    [0, 0, 0],
    [-0.007478408949193623, 2.627048252112721, 1.5015885243156035],
    [-0.007528463439677366, -0.45537866287491535, 1.1317027811060794],
  ],
  interior: [
    [-2.3262856496385274, 0.20924417496911427, -0.03313205280069673],
    [0, 0, 0],
    [-0.4337802580564771, 0.319127318081177, 0.09316887365871929],
    [-0.431768843062556, 0.3001312274226111, -0.554507176768169],
  ],
};

export type NamedViews = typeof namedViews;

export type ViewName = keyof NamedViews;

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
  }

  protected setupControls() {
    super.setupControls();
    this.orbitControls.autoRotateSpeed *= -1;
    this.orbitControls.addEventListener('start', () => {
      this.orbitControls.autoRotate = false;
    });
    const selectControls = new SelectControls(
      [this.model],
      this.camera,
      this.canvas
    );
    selectControls.addEventListener('select', (event) => {
      const e = event as SelectEvent;
      if (e.object) {
        const obj = e.object;
        this.model
          .handleClick(obj)
          .then(() => {
            // 动画播放完毕后
          })
          .catch(() => {});
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
  }

  async switchView(name: ViewName, duration = 2000) {
    const view = namedViews[name];
    if (view) {
      this.orbitControls.autoRotate = false;
      this.model.roofVisible = name !== 'climate';
      await this.panCamera(view[0], view[1], duration);
      if (name === 'interior') {
        await this.model.openPart('door_lf');
      }
      if (view[2] && view[3]) {
        await this.panCamera(view[2], view[3]);
      }
      if (name === 'interior') {
        await this.model.closePart('door_lf');
      }
    }
  }
}
