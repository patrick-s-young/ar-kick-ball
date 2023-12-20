import * as THREE from 'three';
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
// Components
import { Animation } from '@three/Animation';
import { Rotation } from '@math/Rotation';
import { BoxBody } from '@cannon';
import { SOLDIER_CONFIG } from './config';


export function Soldier ({
  isDebugMode = false,
  world,
  onLoadCallback }) {
  const {
    assetPath,
    walkingSpeed,
    meshScaler,
    speedScaler,
    defaultClipAction,
    turningIncrement
  } = SOLDIER_CONFIG.getMeshConfigs({ isDebugMode });
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
  // bone/body animation
  const boneBodyAnimations = [];

  gltfLoader.load(assetPath, (gltf) => {
    gltf.scene.scale.set(meshScaler, meshScaler, meshScaler);
    gltf.scene.traverse((node) => { 
      if (node.isMesh) node.castShadow = true;
    });
    const model = gltf.scene;
    model.position.set(0, 0, 0);
    mesh.add(model);
    animation.init(gltf);
    animation.playClipAction(defaultClipAction);
    addBoneBodyAnimation({
      ...SOLDIER_CONFIG.cannonBodies.rightFoot.bone,
      body: BoxBody({ ...SOLDIER_CONFIG.cannonBodies.rightFoot.boxBody, world })
    });
    addBoneBodyAnimation({
      ...SOLDIER_CONFIG.cannonBodies.leftFoot.bone,
      body: BoxBody({ ...SOLDIER_CONFIG.cannonBodies.leftFoot.boxBody, world })
    });
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

  const addBoneBodyAnimation = ({
    boneName,
    body,
    bodyOffset
  }) => {
    boneBodyAnimations.push({ 
      bone: mesh.getObjectByName(boneName), 
      body, 
      bodyOffset
    });

  }

  const update = (deltaSeconds) => {
    if (mesh.visible === false) return;
    animation?.update(deltaSeconds);
    rotation?.update();

    const x = rotation.xMagnitude * speed;
    const y = rotation.zMagnitude * speed;
    mesh.position.x += x;
    mesh.position.z -= y;

    const boneWorldPos = new THREE.Vector3();
    const boneWorldQuaternion = new THREE.Quaternion();
    boneBodyAnimations.forEach(item => {
      item.bone.getWorldPosition(boneWorldPos);
      item.bone.getWorldQuaternion(boneWorldQuaternion);
      const _bodyOffset = new THREE.Vector3(...item.bodyOffset);
      _bodyOffset.applyQuaternion(boneWorldQuaternion);
      boneWorldPos.add(_bodyOffset);
      item.body.position.set(...boneWorldPos);
      item.body.quaternion.copy(boneWorldQuaternion);
    });
  }

  const setVisible = (isVisible) => mesh.visible = isVisible;

  const setPosition = ({x, y, z}) => {
    mesh.position.x = x;
    mesh.position.y = y;
    mesh.position.z = z;
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
    setPosition,
    addBoneBodyAnimation
  }
}
