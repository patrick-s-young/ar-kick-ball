import * as THREE from 'three';
import { XRManager } from './components/XRManager';
import { ARButton } from './UI/ARButton'
import { Scene } from './components/Scene';
import { Camera } from './components/Camera';
import { Lights } from './components/Lights';
import { Renderer } from './components/Renderer';
import { Reticle } from './components/Reticle';
import { HitTestManager } from './components/HitTestManager';
import './style.css';

export const App = () => {


  const scene = Scene();
  const camera = Camera();
  const lights = Lights();
  scene.addToScene(lights.getLights())
  const reticle = Reticle();
  scene.addToScene(reticle.getMesh());
  const renderer = Renderer();
  let hitTestManager;
  const arButton = ARButton();
  const xrManager = XRManager({ startButton: arButton, onReady }) 
  const clock = new THREE.Clock();

  async function onReady () {
    hitTestManager = HitTestManager({ xrSession: xrManager.xrSession });
    renderer.obj.xr.setReferenceSpaceType( 'local' );
    renderer.obj.xr.setSession( xrManager.xrSession  );
    renderer.obj.setAnimationLoop(animationLoopCallback);
  }

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
    renderer.obj.render(scene.obj, camera.obj);
  }



  return {
    result: {}
  }
}


