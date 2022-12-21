import * as THREE from 'three';

export function Scene() {
  const scene = new THREE.Scene();
  
  const addToScene = (element) => {
    if (Array.isArray(element)) { 
      element.forEach(item => {
        scene.add(item);
      });
    } else {
      scene.add(element)
    }
  }

  const addBox = ({ positionVec3 }) => {
    const boxSize = .25;
    const { x, y, z } = positionVec3;
    const position = new THREE.Vector3(x, y + boxSize * .5, z);
    const geometry = new THREE.BoxGeometry(boxSize, boxSize, boxSize );
    const material = new THREE.MeshBasicMaterial( {color: 0x00ff00} );
    const mesh = new THREE.Mesh( geometry, material );
    mesh.position.set(...position);
    addToScene(mesh);
  }

  return {
    get obj() { return scene },
    addToScene,
    addBox
  }
}