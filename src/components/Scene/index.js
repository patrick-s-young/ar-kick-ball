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

  return {
    get obj() { return scene },
    addToScene
  }
}