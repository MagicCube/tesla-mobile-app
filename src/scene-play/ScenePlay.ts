import {
  AmbientLight,
  DirectionalLight,
  Light,
  PerspectiveCamera,
  PointLight,
  Scene,
  Vector3Tuple,
  WebGLRenderer,
} from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { update as updateAllTweens } from '@tweenjs/tween.js';

export interface Size {
  width: number;
  height: number;
}

export interface ScenePlayOptions {
  size: Size;
  camera?: {
    fov?: number;
  };
}

export class ScenePlay {
  private _size: Size;
  private _renderer: WebGLRenderer;
  private _scene: Scene;
  private _camera: PerspectiveCamera;
  private _lights: Light[] = [];
  private _orbitControls: OrbitControls;
  private _options: ScenePlayOptions;

  constructor(canvas: HTMLCanvasElement, options: ScenePlayOptions) {
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

    (window as any).debug = () => {
      console.info(this.camera.position.toArray());
    };
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

  protected get options() {
    return this._options;
  }

  play() {
    this.animate(0);
  }

  init() {
    this.resizeTo(this.size);
    this.setup();
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
    this._camera.position.set(0, 0, 1);
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
      pointLight.position.set.apply(pointLight.position, position);
      this._scene.add(pointLight);
      this._lights.push(pointLight);
    });
  }

  protected setupScene() {}

  protected setupControls() {
    this._orbitControls.enableDamping = true;
  }

  protected animate(time: number) {
    window.requestAnimationFrame((time) => {
      this.animate(time);
    });
    this.update(time);
  }

  protected update(time: number) {
    updateAllTweens();
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
