import { Tween, Easing } from '@tweenjs/tween.js';
import { Mesh, Object3D } from 'three';

import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { rnd, traverse, vectorToJSON } from '../util';

export class TeslaModel3 extends Object3D {
  private _root: Mesh | null = null;

  async load(onProgress?: (event: ProgressEvent) => void) {
    const loader = new GLTFLoader();
    const gltfDocument = await loader.loadAsync(
      'models/tesla-model-3/scene.gltf',
      onProgress
    );
    const model = gltfDocument.scene.getObjectByName('Tesla_Model_3');
    if (model) {
      model.scale.set(1, 1, 1);
    }
    this._root = model as Mesh;
    this.add(this._root);
  }

  assembly(duration = 6000) {
    let i = 0;
    traverse(this._root!, 4, (child, level) => {
      if (level++ === 0) {
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

  explode(duration = 6000) {
    let i = 0;
    traverse(this._root!, 4, (child, level) => {
      if (level++ === 0) {
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
}
