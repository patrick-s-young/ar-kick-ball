import * as THREE from 'three';
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";


export function reticleFactory() {
  const mesh = new THREE.Group();
  mesh.name = 'reticle';
  mesh.matrixAutoUpdate = false;
  mesh.visible = false;
  const gltfLoader = new GLTFLoader();
  const anim = {};

  gltfLoader.load('/models/reticle_spin.glb', (gltf) => {
    mesh.add(gltf.scene);
    anim.mixer = new THREE.AnimationMixer(gltf.scene);
    anim.clips = gltf.animations;
    anim.clip = THREE.AnimationClip.findByName(anim.clips, 'Spin');
    anim.action = anim.mixer.clipAction(anim.clip);
    anim.action.play();
  });

  const setMatrixFromArray = (matrixArray) => {
    mesh.matrix.fromArray(matrixArray);
  }

  const updateMixer = (deltaSeconds) => {
    if (mesh.visible) anim.mixer?.update(deltaSeconds);
  }

  return {
    get mesh() { return mesh },
    set visible(isVisible) { mesh.visible = isVisible },
    get visible() { return mesh.visible },
    get matrix() { return mesh.matrix },
    get anim() { return anim },
    updateMixer,
    setMatrixFromArray
  }
}

