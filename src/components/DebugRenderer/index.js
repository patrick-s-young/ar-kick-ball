import * as THREE from 'three';

export function DebugRenderer () {
  const renderer = new THREE.WebGLRenderer();
  renderer.setSize( window.innerWidth, window.innerHeight );
  document.body.appendChild( renderer.domElement );

  return {
    render: (scene, camera) => renderer.render(scene, camera),
    get domElement() { return renderer.domElement }
  }
}