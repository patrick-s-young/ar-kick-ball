import * as THREE from 'three';
import { XRManager } from './components/XRManager';
import { ARButton } from './UI/ARButton'
import { Scene } from './components/Scene';
import { Camera } from './components/Camera';
import { Lights } from './components/Lights';
import { Renderer } from './components/Renderer';
import { Reticle } from './components/Reticle';
import { Robot } from './components/Robot';
import { HitTestManager } from './components/HitTestManager';
import './style.css';

export const App = () => {
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
  // ROBOT
  const robot = Robot();
  scene.addToScene(robot.getMesh());


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
    if (reticle.visible) {
      const workingPositionVec3 = new THREE.Vector3();
      workingPositionVec3.setFromMatrixPosition(reticle.matrix);
      //scene.addBox({ positionVec3: workingPositionVec3 });
      robot.visible = true;
      robot.setMatrixFromArray(workingPositionVec3)
    }
  }

  // RENDER LOOP
  function animationLoopCallback(timestamp, frame) {
    const dt = clock.getDelta();
    let hitPoseTransformMatrix = [];
    if ( frame ) {
      if ( hitTestManager.hitTestSourceRequested === false ) hitTestManager.requestHitTestSource();
      hitPoseTransformMatrix = hitTestManager.hitTestSource ? hitTestManager.getHitTestResults(frame) : [];
      if (hitPoseTransformMatrix.length > 0) {
        reticle.visible = true;
        reticle.setMatrixFromArray(hitPoseTransformMatrix)
      } else {
        reticle.visible = false;
      }
    }
    reticle.updateMixer(dt);
    robot.updateMixer(dt);
    renderer.render(scene.obj, camera.obj);
  }

  return null;
}


