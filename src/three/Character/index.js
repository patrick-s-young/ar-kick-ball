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
  // cannon bodies
  let characterBody;
  let rightFootBody;
  let leftFootBody;
  // model bones
  let rightFootBone;
  let leftFootBone;

  gltfLoader.load(assetPath, (gltf) => {
    gltf.scene.scale.set(meshScaler, meshScaler, meshScaler);
    gltf.scene.traverse((node) => { 
      if (node.isMesh) node.castShadow = true;
      if (node.name === 'mixamorigRightFoot') rightFootBone = node; 
      if (node.name === 'mixamorigLeftFoot') leftFootBone = node; 
    });
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

    // if (characterBody === undefined) return;
    // characterBody.body.position.x += x;
    // characterBody.body.position.z -= y;
    // characterBody.body.quaternion.copy(rotation.quaternion);

    const boneWorldPos = new THREE.Vector3();
    const boneWorldQuaternion = new THREE.Quaternion();
    rightFootBone.getWorldPosition(boneWorldPos);
    rightFootBone.getWorldQuaternion(boneWorldQuaternion);
    rightFootBody.body.position.set(...boneWorldPos);
    rightFootBody.body.quaternion.copy(boneWorldQuaternion);

    leftFootBone.getWorldPosition(boneWorldPos);
    leftFootBone.getWorldQuaternion(boneWorldQuaternion);
    leftFootBody.body.position.set(...boneWorldPos);
    leftFootBody.body.quaternion.copy(boneWorldQuaternion);
  }

  const update = (deltaSeconds) => {
    if (mesh.visible === false) return;
    animation?.update(deltaSeconds);
    rotation?.update();
    updatePosition();
  }

  const setVisible = (isVisible) => mesh.visible = isVisible;

  const getBoundingBox = () => new THREE.Box3().setFromObject(mesh);

  const setBody = (_characterBody) => {
    characterBody = _characterBody;
  }

  const setFeetBodies = ({rightFoot, leftFoot}) => {
    rightFootBody = rightFoot;
    leftFootBody = leftFoot;
  }

  const setPosition = ({x, y, z}) => {
    //console.log('Character > setPostion: characterBody:', characterBody)
    mesh.position.x = x;
    mesh.position.y = y;
    mesh.position.z = z;
    //characterBody.setPosition({x, y, z});
  }

  return {
    get mesh() { return mesh },
    get position() { return mesh.position},
    set position(newPosition) { mesh.position.set(...newPosition) },
    set visible(isVisible) { mesh.visible = isVisible },
    get visible() { return mesh.visible },
    get matrix() { return mesh.matrix },
    get clipActionsMap() { return clipActionsMap },
    get rightFootBone() { return rightFootBone },
    update,
    setClipAction,
    setDirection: (radians) =>  rotation.setDirection(radians),
    setVisible,
    getBoundingBox,
    setBody,
    setFeetBodies,
    setPosition
  }
}
