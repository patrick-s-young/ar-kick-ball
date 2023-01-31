import * as THREE from 'three';
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";


export function Robot() {
  const mesh = new THREE.Group();
  mesh.name = 'robot';
  mesh.matrixAutoUpdate = true;
  mesh.visible = false;
  const gltfLoader = new GLTFLoader();
  let animationMixer;
  let animations;
  let animationClip;
  let currentClipAction;


  gltfLoader.load('/models/twistBot.glb', (gltf) => {
    gltf.scene.scale.set(.25, .25, .25);
    mesh.add(gltf.scene);
    animationMixer = new THREE.AnimationMixer(gltf.scene);
    animations = gltf.animations;
    console.log('animations', animations)
    animationClip = THREE.AnimationClip.findByName(animations, 'twist');
    currentClipAction = animationMixer.clipAction(animationClip);
    currentClipAction.play();
  });

  // const updateClipAction = () => {
  //   const animClip = THREE.AnimationClip.findByName(animations, 'twistDance');
  //   const clipAction = animationMixer.clipAction(animClip);
  //   currentClipAction.crossFadeTo(clipAction, 0.5);
  // }

  const setMatrixFromArray = (matrixArray) => {
    mesh.position.set(...matrixArray);
    //mesh.matrix.fromArray(matrixArray);
  }

  const updateMixer = (deltaSeconds) => {
    if (mesh.visible) animationMixer?.update(deltaSeconds);
  }

  return {
    getMesh: () => { return mesh },
    set visible(isVisible) { mesh.visible = isVisible },
    get visible() { return mesh.visible },
    get matrix() { return mesh.matrix },
    updateMixer,
    setMatrixFromArray
  }
}
