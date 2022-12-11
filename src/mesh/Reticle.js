import * as THREE from 'three';
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";

export function Reticle () {
  this.mesh = new THREE.Group();

  const gltfLoader = new GLTFLoader();
  gltfLoader.load('/models/reticle.glb', (gltf) => {
    const model = gltf.scene;
    this.mesh.add(model);
    this.mesh.matrixAutoUpdate = false;
    this.mesh.visible = false;
  });
  this.rotationZ = 0.1;
}


Reticle.prototype.getMesh = function () {
  return this.mesh;
}

Reticle.prototype.setVisible = function (isVisible) {
  this.mesh.visible = isVisible;
}

Reticle.prototype.getVisible = function () {
  return this.mesh.visible;
}

Reticle.prototype.getMatrix = function () {
  return this.mesh.matrix;
}

Reticle.prototype.setMatrixFromArray = function (matrixArray) {
  const rotation4 = new THREE.Matrix4().makeRotationY(Math.PI * this.rotationZ);
  this.mesh.matrix.fromArray(matrixArray);
  this.mesh.matrix.multiply(rotation4)
  this.rotationZ += .05;
}
