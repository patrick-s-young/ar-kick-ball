import * as THREE from 'three';
import { ActionMenu } from './components/ActionMenu';
import { DirectionMenu } from './components/DirectionMenu';
import { XRManager } from './components/XRManager';
import { ARButton } from './UI/ARButton'
import { Scene } from './components/Scene';
import { Camera } from './components/Camera';
import { Lights } from './components/Lights';
import { Renderer } from './components/Renderer';
import { Reticle } from './components/Reticle';
import { Robot } from './components/Robot';
import { Soldier } from './components/Soldier';
import { HitTestManager } from './components/HitTestManager';
import './style.css';

export const App = () => {
  // PARENT OF ACTION AND DIRECTION BUTTONS
  const menuParent = document.createElement('div');
  menuParent.style.position = 'absolute';
  menuParent.style.visibility = 'hidden';
  document.body.appendChild(menuParent);

  // let debugText = 'default';

  // const debugDisplay = document.createElement('div');
  // debugDisplay.style.position = 'absolute';
  // debugDisplay.style.width = '100vw';
  // debugDisplay.style.height = '60px';
  // debugDisplay.style.marginTop = '20px'
  // debugDisplay.style.backgroundColor = 'lightgray';
  // debugDisplay.innerHTML = debugText;

  //document.body.appendChild(debugDisplay);

  // SCENE SETUP
  const scene = Scene();
  const camera = Camera();
  const lights = Lights();
  scene.addToScene(lights.getLights());
  // RENDERER
  const renderer = Renderer();
  const clock = new THREE.Clock();
  // XR SESSION
  const reticle = Reticle();
  scene.addToScene(reticle.getMesh());
  const arButton = ARButton();
  const xrManager = XRManager({ startButton: arButton, onReady }) 
  let hitTestManager;

  let hitTestActive = true;
  // SOLDIER
  const soldier = Soldier(() => {
    const actionMenu = ActionMenu({ 
      menuParent, 
      clipActionsMap: soldier.clipActionsMap, 
      setClipAction: soldier.setClipAction });
    const directionMenu = DirectionMenu({
      menuParent,
      setDirection: soldier.setDirection,
      camera
    })
  });
  scene.addToScene(soldier.mesh);

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
      hitTestActive = false;
      reticle.visible = false;
      menuParent.style.visibility = 'visible';
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


