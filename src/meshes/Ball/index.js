import * as THREE from 'three';

export function Ball() {
  const materialBasic = new THREE.MeshBasicMaterial({
    color: 0xff0000
  });
  const geometry = new THREE.SphereGeometry(.05, 16, 8);
  const mesh = new THREE.Mesh( geometry, materialBasic );
  mesh.position.set(0, 0, 0);
  mesh.visible = false;
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
    set visible(isVisible) { mesh.visible = isVisible },
    get visible() { return mesh.visible },
    setBody,
    setPosition: (newPosition) => { mesh.position.set(...newPosition) },
    update
  }
}