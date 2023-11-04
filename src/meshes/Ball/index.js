import * as THREE from 'three';
import { BallBody } from '@cannon';

export function Ball({ scene, world }) {
  const materialBasic = new THREE.MeshBasicMaterial({
    color: 0xff0000
  });
  const geometry = new THREE.SphereGeometry(.05, 16, 8);
  const mesh = new THREE.Mesh( geometry, materialBasic );
  mesh.position.set(0, 0, 0);
  mesh.visible = true;
  scene.add(mesh);
  // cannon-es
  const ballBody = BallBody({ world });
  ballBody.addToWorld();


  const update = () => {
    const { x , y, z } = ballBody.position
    mesh.position.set(x , y, z);
  }

  return {
    get mesh() { return mesh },
    set visible(isVisible) { mesh.visible = isVisible },
    get visible() { return mesh.visible },
    setPosition: ballBody.setPosition,
    update
  }
}