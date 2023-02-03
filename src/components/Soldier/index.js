import * as THREE from 'three';
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";

const DIRECTION = { 
  TOP: 0,
  RIGHT: -Math.PI/2,
  BOTTOM:  Math.PI,
  LEFT: Math.PI/2
}

export function Soldier(onLoadCallback) {
  // LOADER
  const gltfLoader = new GLTFLoader();
  // MESH
  const mesh = new THREE.Group();
  mesh.name = 'soldier';
  mesh.matrixAutoUpdate = true;
  mesh.visible = false;
  mesh.position.set(0, 0, 0);
  // ANIMATION
  let animationMixer;
  let animationClips;
  let previousAction;
  let activeAction;
  const clipActionsMap = new Map();
  // ROTATION
  const yRotateAngle = new THREE.Vector3(0, 1, 0);
  const yRotateQuaternion = new THREE.Quaternion();
  let yPrev;
  // POSITION
  let targetRadians;
  let xDirection;
  let zDirection;
  let speed = .028;
  setDirection(0);

  gltfLoader.load('/models/Soldier.glb', (gltf) => {
    gltf.scene.scale.set(.125, .125, .125);
    const model = gltf.scene;
    model.position.set(0, 0, 0);
    mesh.add(model);
    animationMixer = new THREE.AnimationMixer(model);
    animationClips = gltf.animations;
    animationClips.filter(ac => ac.name !== 'TPose').forEach(ac => clipActionsMap.set(ac.name, animationMixer.clipAction(ac)));
    setClipAction('Idle');
    if (onLoadCallback !== undefined) onLoadCallback();
  });



  /////////////////////////////////////
  // SET ANIMATION, VELOCITY, DIRECTION
  const setClipAction = (clipActionName) => {
    previousAction = activeAction;
    activeAction = clipActionsMap.get(clipActionName);
    // TRANSITION TO NEW CLIP ACTION
    if (previousAction === activeAction) return;
    if (previousAction !== undefined ) previousAction.fadeOut(.5);
    activeAction
      .reset()
      .setEffectiveTimeScale(1)
      .setEffectiveWeight(1)
      .fadeIn(.5)
      .play();
    // SET NEW SPEED
    if (clipActionName === 'Idle') {
      speed = 0;
    } else if (clipActionName === 'Walk') {
      speed = .028 * 0.25;
    } else {
      speed = .07 * 0.25;
    }
  }
  // SET DIRECTION
  function setDirection (radians) {
    targetRadians = radians; //DIRECTION[newDirection];
    yRotateQuaternion.setFromAxisAngle(yRotateAngle, targetRadians);
  }
  // SET POSITION TO HIT TEST RESULTS
  const setMatrixFromArray = (matrixArray) => {
    mesh.position.set(...matrixArray);
    mesh.visible = true;
    //mesh.matrix.fromArray(matrixArray);
  }



  ////////////////////////////////////////
  // UPDATE ANIMATION, POSITION, DIRECTION
  const updateMixer = (deltaSeconds) => {
      animationMixer?.update(deltaSeconds);
  }
  const updateRotation = () => {
    mesh.quaternion.rotateTowards(yRotateQuaternion, .05);
    const [x, yNow, z, w] = mesh.quaternion.toArray();
    if (yNow !== yPrev) {
      const angle = 2 * Math.acos(w);
      let s;
      if (1 - w * w < 0.000001) {
        s = 1;
      } else {
        s = Math.sqrt(1 - w * w);
      }
      //const result = { axis: new THREE.Vector3(x/s, yNow/s, z/s), angle }
      const yAngle = yNow/s * angle;
      xDirection= Math.sin(-yAngle);
      zDirection = Math.cos(yAngle);
      yPrev = yNow;
    }
  }
  const updatePosition = () => {
    mesh.position.x += xDirection* speed;
    mesh.position.z -= zDirection * speed;
  }
  const update = (deltaSeconds) => {
    if (mesh.visible === false) return;
    updateMixer(deltaSeconds);
    updateRotation();
    updatePosition();
  }
//
////////////////////////

  return {
    get mesh() { return mesh },
    set visible(isVisible) { mesh.visible = isVisible },
    get visible() { return mesh.visible },
    get matrix() { return mesh.matrix },
    get clipActionsMap() { return clipActionsMap },
    update,
    setMatrixFromArray,
    setClipAction,
    setDirection
  }
}
