import { Easing, Tween } from '@tweenjs/tween.js';
import { Vector3 } from 'three';
import { SelectControls } from '../controls/SelectControls';

import { ScenePlay, ScenePlayOptions } from '../ScenePlay';
import { traverse, vectorToJSON } from '../util';

import { TeslaModel3 } from './TeslaModel3';

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
    this.scene.add(this.model);
    await this.model.load();

    this.explode(0);

    this.assembly(6000);
    await this.moveCamera(
      [-5.8356834892220375, 4.567450211769818, -3.4891564032644835],
      4000
    );
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

  explode(duration = 6000) {
    let i = 0;
    traverse(this.model, 4, (child, level) => {
      if (level++ <= 1) {
        return;
      }

      const l = 5 - level;

      // Save original position and rotation.
      child.userData = {
        position: vectorToJSON(child.position),
        rotation: vectorToJSON(child.rotation),
      };

      const name = child.name.toLowerCase();
      let isSunRoof = name.startsWith('glass_glass');

      const target = {
        position: {
          x: rnd(5),
          y: rnd(10),
          z: isSunRoof ? Math.abs(rnd(5)) : rnd(5),
        },
        rotation: { x: rnd(Math.PI), y: rnd(Math.PI), z: rnd(Math.PI) },
      };

      if (duration > 0) {
        new Tween(child.position)
          .to(target.position, rnd(duration / 2, false))
          .delay(l * 5 + i * 15)
          .easing(Easing.Cubic.InOut)
          .start();
        new Tween(child.rotation)
          .to(target.rotation, rnd(duration / 2, false))
          .delay(l * 5 + i * 12)
          .easing(Easing.Cubic.InOut)
          .start();
      } else {
        child.position.set(
          target.position.x,
          target.position.y,
          target.position.z
        );
        child.rotation.set(
          target.rotation.x,
          target.rotation.y,
          target.rotation.z
        );
      }
    });

    return new Promise<void>((resolve) => {
      setTimeout(() => {
        resolve();
      }, duration);
    });
  }

  assembly(duration = 6000) {
    let i = 0;
    traverse(this.model, 4, (child, level) => {
      if (level++ <= 1) {
        return;
      }

      i++;
      const l = 5 - level;
      const target = child.userData;
      if (duration > 0) {
        new Tween(child.position)
          .to(target.position, rnd(duration / 2, false))
          .delay(l * 5 + i * 15)
          .easing(Easing.Cubic.InOut)
          .start();
        new Tween(child.rotation)
          .to(target.rotation, rnd(duration / 2, false))
          .delay(l * 5 + i * 12)
          .easing(Easing.Cubic.InOut)
          .start();
      } else {
        child.position.set(
          target.position.x,
          target.position.y,
          target.position.z
        );
        child.rotation.set(
          target.rotation.x,
          target.rotation.y,
          target.rotation.z
        );
      }
    });

    return new Promise<void>((resolve) => {
      setTimeout(() => {
        resolve();
      }, duration);
    });
  }
}

function rnd(num: number, bothPositiveAndNegative = true) {
  if (bothPositiveAndNegative) {
    return Math.random() * num * 2 - num;
  } else {
    return Math.random() * num;
  }
}
