import * as THREE from 'three';
import { BallBody } from '@cannon';
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";

export const SoccerBall = ({ 
  assetPath,
  onLoadCallback,
  scene,
  world }) => {
  // LOADER
  const gltfLoader = new GLTFLoader();
  const mesh = new THREE.Group();
  const meshScaler = 0.35;
  mesh.visible = true;

  gltfLoader.load(assetPath, (gltf) => {
    gltf.scene.scale.set(meshScaler, meshScaler, meshScaler);
    gltf.scene.traverse((node) => { if (node.isMesh) node.castShadow = true });
    const model = gltf.scene;
    model.position.set(0, -0.039, 0);
    mesh.add(model);
    scene.add(mesh);
    if (onLoadCallback !== undefined) onLoadCallback(mesh);
  });


  // cannon-es
  const ballBody = BallBody({ world });
  ballBody.addToWorld();


  const update = () => {
    const { x , y, z } = ballBody.position
    mesh.position.set(x, y, z);
    mesh.quaternion.copy(ballBody.quaternion);
  }

  return {
    get mesh() { return mesh },
    set visible(isVisible) { mesh.visible = isVisible },
    get visible() { return mesh.visible },
    setPosition: ballBody.setPosition,
    update
  }
}