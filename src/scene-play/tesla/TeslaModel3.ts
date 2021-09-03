import { Tween, Easing } from '@tweenjs/tween.js';
import { LoadingManager, Mesh, Object3D } from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

import { allowAnimation } from '@/config';

import { rnd, traverse, vectorToJSON } from '../util';

const IS_DEV_MODE = import.meta.env.MODE === 'development';

const MOVABLE_PARTS = {
  bonnet_ok_primary_0: {
    isOpen: false,
    type: 'rotation',
    axis: 'x',
    offset: Math.PI / 3,
  },
  boot_dummy: {
    isOpen: false,
    type: 'rotation',
    axis: 'x',
    offset: -Math.PI / 6,
  },
  door_lf: {
    isOpen: false,
    type: 'rotation',
    axis: 'z',
    offset: -Math.PI / 3,
  },
  door_lr: {
    isOpen: false,
    type: 'rotation',
    axis: 'z',
    offset: -Math.PI / 3,
  },
  door_rf: {
    isOpen: false,
    type: 'rotation',
    axis: 'z',
    offset: Math.PI / 3,
  },
  door_rr: {
    isOpen: false,
    type: 'rotation',
    axis: 'z',
    offset: Math.PI / 3,
  },
  door_lf_glass0_0: {
    isOpen: false,
    type: 'position',
    axis: 'z',
    offset: -0.2,
  },
  door_lr_glass0_0: {
    isOpen: false,
    type: 'position',
    axis: 'z',
    offset: -0.2,
  },
  door_rf_glass0_0: {
    isOpen: false,
    type: 'position',
    axis: 'z',
    offset: -0.2,
  },
  door_rr_glass0_0: {
    isOpen: false,
    type: 'position',
    axis: 'z',
    offset: -0.2,
  },
};

type MovablePartName = keyof typeof MOVABLE_PARTS;

const MOVABLE_PART_NAMES = Object.keys(MOVABLE_PARTS);

interface PositionRotation {
  position: { x: number; y: number; z: number };
  rotation: { x: number; y: number; z: number };
}

export class TeslaModel3 extends Object3D {
  private _root: Mesh | null = null;

  private _roofVisible = true;

  private _movableParts = {
    ...MOVABLE_PARTS,
  };

  get allowAnimation() {
    return allowAnimation;
  }

  get roofVisible() {
    return this._roofVisible;
  }

  set roofVisible(value) {
    if (this._roofVisible !== value) {
      this._setRoofVisible(value);
    }
  }

  async load(
    onProgress?: (progress: {
      url: string;
      loaded: number;
      total: number;
    }) => void
  ) {
    const manager = new LoadingManager();
    manager.onProgress = (url, loaded, total) => {
      if (typeof onProgress === 'function') {
        onProgress({
          url,
          loaded,
          total,
        });
      }
    };
    const loader = new GLTFLoader(manager);
    const gltfDocument = await loader.loadAsync(
      IS_DEV_MODE
        ? 'models/tesla-model-3/scene.gltf'
        : 'https://feng-docs.oss-cn-hangzhou.aliyuncs.com/tesla-model-3/scene.gltf'
    );
    const model = gltfDocument.scene.getObjectByName('Tesla_Model_3');
    if (model) {
      model.scale.set(1, 1, 1);
    }
    this._root = model as Mesh;
    this.add(this._root);
  }

  assembly(duration = 6000) {
    if (!this._root) {
      return Promise.resolve();
    }
    let i = 0;
    traverse(this._root, 4, (child, level) => {
      if (i++ === 0) {
        return;
      }

      const l = 5 - level;
      const keepOnTop = isKeepOnTop(child);
      const target = child.userData as PositionRotation;
      if (allowAnimation && duration > 0) {
        new Tween(child.position)
          .to(target.position, rnd(duration / 2, false))
          .delay((l * 5 + i * 15) * (keepOnTop ? 1.2 : 1))
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
    if (!this._root) {
      return Promise.resolve();
    }

    let i = 0;
    traverse(this._root, 4, (child, level) => {
      if (i++ === 0) {
        return;
      }

      const l = 5 - level;

      // Save original position and rotation.
      child.userData = {
        position: vectorToJSON(child.position),
        rotation: vectorToJSON(child.rotation),
      } as PositionRotation;

      const keepOnTop = isKeepOnTop(child);
      const target: PositionRotation = {
        position: {
          x: rnd(5),
          y: rnd(10),
          z: keepOnTop ? rnd(5, false) + 5 : rnd(5),
        },
        rotation: { x: rnd(Math.PI), y: rnd(Math.PI), z: rnd(Math.PI) },
      };

      if (allowAnimation && duration > 0) {
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

  togglePart(name: MovablePartName) {
    const part = this._movableParts[name];
    const target = this._root?.getObjectByName(name);
    if (part && target) {
      if (!part.isOpen) {
        part.isOpen = true;
        new Tween(target)
          .to({ [part.type]: { [part.axis]: part.offset } }, 500)
          .start();
      } else {
        part.isOpen = false;
        new Tween(target).to({ [part.type]: { [part.axis]: 0 } }, 500).start();
      }
    }
  }

  handleClick(obj: Object3D) {
    let target: Object3D | null = obj;
    while (target !== null && !MOVABLE_PART_NAMES.includes(target.name)) {
      if (target.parent) {
        target = target.parent;
      } else {
        target = null;
        break;
      }
    }
    if (target) {
      const name = target.name as MovablePartName;
      this.togglePart(name);
    }
  }

  private _setRoofVisible(visible: boolean) {
    this._roofVisible = visible;
    const target = vectorToJSON([0, 0, this.roofVisible ? 0 : 5]);
    [
      'windscreen_ok_glass0_0',
      'glass_glass1_0',
      'black003_black_lights0_0',
      'whiteleather_Putih0_0',
      'Leather_white_Seat_Leather_white0_0',
      'Putih002_Putih0_0',
      'Plastic_Plastic0_0',
      'interiorlights_light_night_0',
      'mirror_inside_mirror_inside0_0',
      'aluminium2_aluminium20_0',
    ].forEach((name) => {
      const part = this._root?.getObjectByName(name);
      if (part) {
        new Tween(part.position)
          .to(target, 500 + 500 * Math.random())
          .delay(Math.random() * 500)
          .start();
      }
    });
  }
}

function isKeepOnTop(obj: Object3D) {
  return [
    'bonnet_ok_primary_0',
    'boot_primary_0',
    'glass_glass1_0',
    'glass_glass1_1',
    'windscreen_ok_glass0_0',
  ].includes(obj.name);
}
