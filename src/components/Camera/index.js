import * as THREE from 'three';

export function Camera() {
  const camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 0.01, 20 );
  camera.position.set( 0, 1.6, 3 );

  return {
    get self() { return camera },
    get quaternion() { return camera.quaternion },
    setPosition: ({ x, y, z }) => camera.position.set(x, y, z)
  }
}