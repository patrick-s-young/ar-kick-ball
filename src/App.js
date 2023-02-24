// Three
import * as THREE from 'three';
// Scene
import { Scene } from './components/Scene';
import { Camera } from './components/Camera';
import { Lights } from './components/Lights';
// GLTF
import { Reticle } from './components/Reticle';
import { Character } from './components/Character';
// Geometry
import { Floor } from './components/Floor';
// Renderer
import { Renderer } from './components/Renderer';
// WebXR
import { XRManager } from './components/XRManager';
import { HitTestManager } from './components/HitTestManager';
// UI
import { DirectionControls } from './components/DirectionControls';
import { ARButton } from './components/ARButton'
// Configs
import { CONFIGS } from './configs';
// Styles
import './style.css';


//////////////////
// BEGIN COMPONENT
export const App = () => {
  // SCENE SETUP
  const scene = Scene();
  const camera = Camera();
  const lights = Lights();
  scene.add(lights.getLights());
  // GLTF
  const reticle = Reticle();
  scene.add(reticle.getMesh());
  const soldier = Character({...CONFIGS, onLoadCallback: initDirectionMenu });
  scene.add(soldier.mesh);
  // Geometry
  const floor = new Floor();
  scene.add(floor.mesh);
  // UI
  const uiParent = document.createElement('div');
  uiParent.style.position = 'absolute';
  uiParent.style.visibility = 'hidden';
  document.body.appendChild(uiParent);
  const arButton = ARButton();
  let directionControls;
  function initDirectionMenu() {
    directionControls = DirectionControls({
      uiParent,
      setDirection: soldier.setDirection,
      setClipAction: soldier.setClipAction,
      camera
    }) 
  }
  // RENDERER
  const renderer = Renderer();
  const clock = new THREE.Clock();
  // XR MANAGER
  const xrManager = XRManager({ startButton: arButton, onReady });
  let hitTestManager;
  let hitTestActive = true;
 


  // XR SESSION READY
  async function onReady () {
    hitTestManager = HitTestManager({ xrSession: xrManager.xrSession });
    xrManager.setOnSelectCallback(onSelectCallback)
    renderer.setReferenceSpaceType( 'local' );
    renderer.setSession( xrManager.xrSession  );
    renderer.setAnimationLoop(animationLoopCallback);
  }

  // ON SCREEN TAP
  const onSelectCallback = (ev) => {
    if (hitTestActive === false) return;
    if (reticle.visible) {
      const workingPositionVec3 = new THREE.Vector3();
      workingPositionVec3.setFromMatrixPosition(reticle.matrix);
      // set position & show character and shadow
      soldier.position = workingPositionVec3;
      soldier.visible = true;
      floor.position = workingPositionVec3;
      floor.visible = true;
      // disable hit test & hide reticle
      hitTestActive = false;
      reticle.visible = false; 
      // move to UI component
      uiParent.style.visibility = 'visible';
      directionControls?.enableTouch();
    }
  }

  // RENDER LOOP
  function animationLoopCallback(timestamp, frame) {
    const dt = clock.getDelta();
      let hitPoseTransformMatrix = [];
      if ( frame && hitTestActive === true) {
        if ( hitTestManager.hitTestSourceRequested === false ) hitTestManager.requestHitTestSource();
        hitPoseTransformMatrix = hitTestManager.hitTestSource ? hitTestManager.getHitTestResults(frame) : [];
        if (hitPoseTransformMatrix.length > 0) {
          reticle.visible = true;
          reticle.setMatrixFromArray(hitPoseTransformMatrix);
        } else {
          reticle.visible = false;
        }
      }
    reticle.updateMixer(dt);
    soldier.update(dt);
    floor.position = soldier.position;
    renderer.render(scene.self, camera.self);
  }

  return null;
}


