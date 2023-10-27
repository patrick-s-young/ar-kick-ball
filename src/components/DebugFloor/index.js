import * as THREE from 'three';

export function DebugFloor() {
  const loader = new THREE.TextureLoader();
  const texture = loader.load('/models/floor/checkerboard.png');
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.x = texture.repeat.y = 400;

  const material = new THREE.MeshBasicMaterial({
    map: texture
  });

  const materialShadow = new THREE.ShadowMaterial();
  materialShadow.opacity = 0.2;

  const geometry = new THREE.PlaneGeometry(100, 100);
  const mesh = new THREE.Mesh( geometry, material );
  mesh.rotateX(-Math.PI / 2);
  mesh.receiveShadow = true;

  return {
    get mesh() { return mesh }
  }
}