import * as THREE from 'three';
// UI
import { DirectionMenu } from './components/DirectionMenu';
import { ARButton } from './UI/ARButton'
// WebXR
import { XRManager } from './components/XRManager';
import { HitTestManager } from './components/HitTestManager';
// Render
import { Renderer } from './components/Renderer';
// Scene
import { Scene } from './components/Scene';
import { Camera } from './components/Camera';
import { Lights } from './components/Lights';
// Models
import { Reticle } from './components/Reticle';
import { Soldier } from './components/Soldier';
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
  // MODELS
  const reticle = Reticle();
  scene.add(reticle.getMesh());
  const soldier = Soldier(initDirectionMenu);
  scene.add(soldier.mesh);
  // UI
  const menuParent = document.createElement('div');
  menuParent.style.position = 'absolute';
  menuParent.style.visibility = 'hidden';
  document.body.appendChild(menuParent);
  const arButton = ARButton();
  let directionMenu;
  function initDirectionMenu() {
    directionMenu = DirectionMenu({
      menuParent,
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
      soldier.setMatrixFromArray(workingPositionVec3);
      // disable hit test
      hitTestActive = false;
      reticle.visible = false; 
      // move to UI component
      menuParent.style.visibility = 'visible';
      directionMenu.enableTouch();
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
    renderer.render(scene.obj, camera.obj);
  }

  return null;
}


