import * as THREE from 'three';
import * as CANNON from 'cannon-es';
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
  // BODY
  let body;


  gltfLoader.load(assetPath, (gltf) => {
    gltf.scene.scale.set(meshScaler, meshScaler, meshScaler);
    gltf.scene.traverse((node) => { if (node.isMesh) node.castShadow = true });
    const model = gltf.scene;
    model.position.set(0, 0, 0);
    mesh.add(model);
    animation.init(gltf);
    animation.playClipAction(defaultClipAction);
    if (onLoadCallback !== undefined) onLoadCallback(mesh);
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
    const x = rotation.xMagnitude * speed;
    const y = rotation.zMagnitude * speed;
    mesh.position.x += x;
    mesh.position.z -= y;

    if (body === undefined) return;
    body.position.x += x;
    body.position.z -= y;
    body.quaternion.copy(rotation.quaternion)
  }

  const update = (deltaSeconds) => {
    if (mesh.visible === false) return;
    animation?.update(deltaSeconds);
    rotation?.update();
    updatePosition();
  }

  const setVisible = (isVisible) => mesh.visible = isVisible;

  const getBoundingBox = () => new THREE.Box3().setFromObject(mesh);

  const setBody = (_body) => {
    body = _body;
  }

  const setPosition = ({x, y, z}) => {
    mesh.position.x = x;
    mesh.position.z = z;
    body.position.x = x;
    body.position.z = z;
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
    setDirection: (radians) =>  rotation.setDirection(radians),
    setVisible,
    getBoundingBox,
    setBody,
    setPosition
  }
}
