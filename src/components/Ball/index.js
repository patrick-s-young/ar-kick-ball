import * as THREE from 'three';

export function Ball() {
  const materialBasic = new THREE.MeshBasicMaterial({
    color: 0xff0000
  });
  const geometry = new THREE.SphereGeometry(.025, 32, 16);
  const mesh = new THREE.Mesh( geometry, materialBasic );
  mesh.position.set(0, 0, 0);
  mesh.visible = true;
  let body;

  const setBody = (_body) => {
    body = _body;
  }

  const update = () => {
    const { x , y, z} = body.position
    mesh.position.set( x , y, z);
  }

  return {
    get mesh() { return mesh },
    setBody,
    setPosition: (newPosition) => { mesh.position.set(...newPosition) },
    update
  }
}