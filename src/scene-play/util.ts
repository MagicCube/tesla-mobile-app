import { Euler, Object3D, Vector3, Vector3Tuple } from 'three';

export function rnd(num: number, bothPositiveAndNegative = true) {
  if (bothPositiveAndNegative) {
    return Math.random() * num * 2 - num;
  } else {
    return Math.random() * num;
  }
}

export function vector3(point: Vector3 | Vector3Tuple): Vector3 {
  if (Array.isArray(point) && point.length === 3) {
    return new Vector3(point[0], point[1], point[2]);
  } else {
    return point;
  }
}

export function vectorToJSON(vector: Vector3 | Vector3Tuple | Euler): {
  x: number;
  y: number;
  z: number;
} {
  if (Array.isArray(vector) && vector.length === 3) {
    return { x: vector[0], y: vector[1], z: vector[2] };
  } else {
    return { x: vector.x, y: vector.y, z: vector.z };
  }
}

export function traverse(
  obj: Object3D,
  maxLevels: number,
  callback: (child: Object3D, level: number) => void,
  level = 0
) {
  callback(obj, level);
  if (level < maxLevels) {
    obj.children.forEach((child) => {
      traverse(child, maxLevels, callback, level + 1);
    });
  }
}
