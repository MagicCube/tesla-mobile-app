import {
  AmbientLight,
  DirectionalLight,
  EventDispatcher,
  Light,
  PerspectiveCamera,
  PointLight,
  Scene,
  Vector3,
  Vector3Tuple,
  WebGLRenderer,
} from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { Easing, Tween, update as updateAllTweens } from '@tweenjs/tween.js';

import { allowAnimation } from '@/config';

import { Size } from './types';
import { vector3, vectorToJSON } from './util';

export interface ScenePlayOptions {
  size: Size;
  camera?: {
    fov?: number;
    position?: Vector3 | Vector3Tuple;
    target?: Vector3 | Vector3Tuple;
    easing?: EasingFunction;
  };
}

export type EasingFunction = (amount: number) => number;

export class ScenePlay extends EventDispatcher {
  private _size: Size;

  private _renderer: WebGLRenderer;

  private _scene: Scene;

  private _camera: PerspectiveCamera;

  private _lights: Light[] = [];

  private _orbitControls: OrbitControls;

  private _options: ScenePlayOptions;

  constructor(canvas: HTMLCanvasElement, options: ScenePlayOptions) {
    super();

    this._options = options;
    this._size = options.size;
    this._renderer = new WebGLRenderer({
      canvas,
      antialias: true,
      logarithmicDepthBuffer: true,
    });
    this._scene = new Scene();
    this._camera = new PerspectiveCamera(options.camera?.fov || 75);
    this._camera.name = 'main-camera';
    this._orbitControls = new OrbitControls(this._camera, this.canvas);
  }

  get canvas() {
    return this._renderer.domElement;
  }

  get size() {
    return this._size;
  }

  set size(value) {
    this.resizeTo(value);
  }

  get renderer() {
    return this._renderer;
  }

  get scene() {
    return this._scene;
  }

  get camera() {
    return this._camera;
  }

  get lights() {
    return this._lights;
  }

  get orbitControls() {
    return this._orbitControls;
  }

  get allowAnimation() {
    return allowAnimation;
  }

  protected get options() {
    return this._options;
  }

  init() {
    this.resizeTo(this.size);
    this.setup();
  }

  play() {
    this.animate(0);
  }

  debug() {
    // eslint-disable-next-line no-console
    console.info(
      this.camera.position.toArray(),
      this._orbitControls.target.toArray()
    );
  }

  panCamera(
    position: Vector3 | Vector3Tuple,
    target: Vector3 | Vector3Tuple,
    duration = 1200,
    easing?: EasingFunction
  ) {
    if (this.allowAnimation && duration > 0) {
      const positionJSON = vectorToJSON(position);
      const targetJSON = vectorToJSON(target);
      return new Promise<void>((resolve) => {
        new Tween(this.camera.position)
          .to(positionJSON, duration)
          .onComplete(() => {
            resolve();
          })
          .easing(easing || this.options.camera?.easing || Easing.Linear.None)
          .start();
        new Tween(this._orbitControls.target)
          .to(targetJSON)
          .easing(easing || this.options.camera?.easing || Easing.Linear.None)
          .start();
      });
    } else {
      this.camera.position.copy(vector3(position));
      this._orbitControls.target.copy(vector3(target));
      return Promise.resolve();
    }
  }

  moveCamera(
    position: Vector3 | Vector3Tuple,
    duration = 1200,
    easing?: EasingFunction
  ) {
    return this.panCamera(position, [0, 0, 0], duration, easing);
  }

  protected setup() {
    this.setupRenderer();
    this.setupCamera();
    this.setupLights();
    this.setupScene();
    this.setupControls();
  }

  protected setupRenderer() {}

  protected setupCamera() {
    const position = vector3(this.options.camera?.position || [0, 0, 1]);
    this._camera.position.copy(position);
  }

  protected setupLights() {
    const ambientLight = new AmbientLight(0xffffff, 0.2);
    ambientLight.name = 'ambient-light';
    this._scene.add(ambientLight);
    this._lights.push(ambientLight);

    const mainLight = new DirectionalLight(0xffffff, 0.75);
    mainLight.name = 'main-light';
    mainLight.position.set(0, 1, 0);
    mainLight.castShadow = true;
    this._scene.add(mainLight);
    this._lights.push(mainLight);

    (
      [
        [0, 300, 500],
        [500, 100, 0],
        [0, 100, -500],
        [-500, 300, 500],
      ] as Vector3Tuple[]
    ).forEach((position, i) => {
      const pointLight = new PointLight(0xc4c4c4, 0.5);
      pointLight.name = `point-light-${i + 1}`;
      pointLight.position.set(...position);
      this._scene.add(pointLight);
      this._lights.push(pointLight);
    });
  }

  protected setupScene() {}

  protected setupControls() {
    this._orbitControls.enableDamping = true;
    const target = vector3(this.options.camera?.target || [0, 0, 0]);
    this._orbitControls.target.copy(target);
  }

  protected animate(time: number) {
    window.requestAnimationFrame((t) => {
      this.animate(t);
    });
    this.update(time);
  }

  protected update(time: number) {
    updateAllTweens(time);
    this._orbitControls.update();
    this._renderer.render(this.scene, this.camera);
  }

  resizeTo(size: Size) {
    this._size = size;
    this._renderer.setSize(this._size.width, this._size.height);
    this._camera.aspect = this._size.width / this._size.height;
    this._camera.updateProjectionMatrix();
  }
}
