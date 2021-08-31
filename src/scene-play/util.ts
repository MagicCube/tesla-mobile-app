import { Vector3, Vector3Tuple } from 'three';

export function vector3(point: Vector3 | Vector3Tuple): Vector3 {
  if (Array.isArray(point) && point.length === 3) {
    return new Vector3(point[0], point[1], point[2]);
  }
  return point;
}

export function vectorToJSON(vector: Vector3 | Vector3Tuple) {
  if (Array.isArray(vector) && vector.length === 3) {
    return { x: vector[0], y: vector[1], z: vector[2] };
  } else {
    return { x: vector.x, y: vector.y, z: vector.z };
  }
}
