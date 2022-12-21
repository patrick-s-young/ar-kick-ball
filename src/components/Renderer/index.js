import * as THREE from 'three';

export function Renderer() {
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true } );
  renderer.setPixelRatio( window.devicePixelRatio );
  renderer.setSize( window.innerWidth, window.innerHeight );
  renderer.outputEncoding = THREE.sRGBEncoding;
  renderer.xr.enabled = true;

  return {
    setReferenceSpaceType: renderer.xr.setReferenceSpaceType,
    setSession: (session) => renderer.xr.setSession(session),
    setAnimationLoop: renderer.setAnimationLoop,
    render: (scene, camera) => renderer.render(scene, camera),
    get obj() { return renderer },
  }
}