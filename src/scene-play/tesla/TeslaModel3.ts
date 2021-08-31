import { Mesh, Object3D } from 'three';

import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

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
}
