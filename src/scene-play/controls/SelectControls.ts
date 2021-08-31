import {
  Camera,
  EventDispatcher,
  Intersection,
  Object3D,
  Raycaster,
  Vector2,
} from 'three';

export class SelectControls extends EventDispatcher {
  private _pointer: Vector2 = new Vector2(0, 0);
  private _selection: Object3D | null = null;
  private _raycaster = new Raycaster();

  constructor(
    private readonly _objects: Object3D[],
    private readonly _camera: Camera,
    private readonly _domElement: HTMLElement
  ) {
    super();
    this.activate();
  }

  get selection() {
    return this._selection;
  }

  activate() {
    this._domElement.addEventListener('pointerdown', this._handlePointerDown);
  }

  deactivate() {
    this._domElement.removeEventListener(
      'pointerdown',
      this._handlePointerDown
    );
  }

  dispose() {
    this.deactivate();
  }

  private _updatePointer(event: PointerEvent) {
    const rect = this._domElement.getBoundingClientRect();
    this._pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    this._pointer.y = (-(event.clientY - rect.top) / rect.height) * 2 + 1;
  }

  private _handlePointerDown = (event: PointerEvent) => {
    this._updatePointer(event);

    const intersections: Intersection[] = [];
    this._raycaster.setFromCamera(this._pointer, this._camera);
    this._raycaster.intersectObjects(this._objects, true, intersections);

    if (intersections.length > 0) {
      this._selection = intersections[0].object;
      const event = {
        type: 'select',
        target: this._selection,
      };
      this.dispatchEvent(event);
    }
  };
}
