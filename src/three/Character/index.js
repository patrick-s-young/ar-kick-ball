import * as THREE from 'three';
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
// Components
import { Animation } from '../Animation';
import { Rotation } from '../../math/Rotation';


export function Character({
  assetPath,
  walkingSpeed,
  meshScaler,
  speedScaler,
  defaultClipAction,
  turningIncrement,
  onLoadCallback }) {
  // LOADER
  const gltfLoader = new GLTFLoader();
  // MODEL
  const mesh = new THREE.Group();
  mesh.matrixAutoUpdate = true;
  mesh.visible = false;
  mesh.position.set(0, 0, 0);
  // ANIMATION HANDLER
  const animation = Animation();
  // ROTATION HANDLER
  const rotation = Rotation({ mesh, defaultRotation: 0, turningIncrement });
  // SPEED
  let speed = 0;

  gltfLoader.load(assetPath, (gltf) => {
    gltf.scene.scale.set(meshScaler, meshScaler, meshScaler);
    gltf.scene.traverse((node) => { if (node.isMesh) node.castShadow = true });
    const model = gltf.scene;
    model.position.set(0, 0, 0);
    mesh.add(model);
    animation.init(gltf);
    animation.playClipAction(defaultClipAction);
    if (onLoadCallback !== undefined) onLoadCallback();
  });


  const setClipAction = (clipActionName) => {
    animation.playClipAction(clipActionName);
    // SET NEW SPEED
    if (clipActionName === 'Idle') {
      speed = 0;
    } else if (clipActionName === 'Walk') {
      speed = walkingSpeed * speedScaler;
    }
  }

  const updatePosition = () => {
    mesh.position.x += rotation.xMagnitude * speed;
    mesh.position.z -= rotation.zMagnitude * speed;
  }

  const update = (deltaSeconds) => {
    if (mesh.visible === false) return;
    animation?.update(deltaSeconds);
    rotation?.update();
    updatePosition();
  }


  return {
    get mesh() { return mesh },
    get position() { return mesh.position},
    set position(newPosition) { mesh.position.set(...newPosition) },
    set visible(isVisible) { mesh.visible = isVisible },
    get visible() { return mesh.visible },
    get matrix() { return mesh.matrix },
    get clipActionsMap() { return clipActionsMap },
    update,
    setClipAction,
    setDirection: (radians) =>  rotation.setDirection(radians)
  }
}
