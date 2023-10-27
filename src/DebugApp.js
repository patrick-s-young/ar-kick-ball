// Three
import * as THREE from 'three';
// Scene
import { Scene } from './components/Scene';
import { Camera } from './components/Camera';
import { Lights } from './components/Lights';
// GLTF
import { Character } from './components/Character';
// Geometry
import { Floor } from './components/Floor';
import { DebugFloor } from './components/DebugFloor';
// DebugRenderer
import { DebugRenderer } from './components/DebugRenderer';
// Debug Controls
import { KeyEvents } from './components/KeyEvents';
// Configs
import { CONFIGS } from './configs';
// Dev/Debug
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
// Styles
import './style.css';


//////////////////
// BEGIN COMPONENT
export const DebugApp = () => {
  // SCENE SETUP
  const scene = Scene();
  const camera = Camera();
  camera.setPosition({ x: 0, y: .4, z: .6 });
  const lights = Lights();
  scene.add(lights.getLights());
  // GLTF
  const soldier = Character({...CONFIGS});
  soldier.mesh.visible = true;
  scene.add(soldier.mesh);
  const animationClock = new THREE.Clock();
  // Geometry
  const floor = new Floor();
  scene.add(floor.mesh);
  const debugFloor = new DebugFloor();
  scene.add(debugFloor.mesh);
  // Renderer
  const renderer = new DebugRenderer();
  // Debug Controls
  const keyEvents = new KeyEvents();
  keyEvents.addTimeOutAction({
    timeoutDuration: 500,
    timeoutCallback: () => soldier.setClipAction('Idle')
  })
  keyEvents.addSubscriber({ 
    keyName: 'ArrowUp', 
    keyAction: 'keydown', 
    callBack: () => { soldier.setDirection(0); soldier.setClipAction('Walk'); }
    });
  keyEvents.addSubscriber({ 
    keyName: 'ArrowRight', 
    keyAction: 'keydown', 
    callBack: () => { soldier.setDirection(-Math.PI/2); soldier.setClipAction('Walk'); }
    });
  keyEvents.addSubscriber({ 
    keyName: 'ArrowDown', 
    keyAction: 'keydown', 
    callBack: () => { soldier.setDirection(Math.PI); soldier.setClipAction('Walk'); }
    });
  keyEvents.addSubscriber({ 
    keyName: 'ArrowLeft', 
    keyAction: 'keydown', 
    callBack: () => { soldier.setDirection(Math.PI/2); soldier.setClipAction('Walk'); }
    });
  const controls = new OrbitControls( camera.self, renderer.domElement );

  function animate() {
    const dt = animationClock.getDelta();
    soldier.update(dt);
    requestAnimationFrame( animate );
    controls.update();
    renderer.render( scene.self, camera.self );
  }
  animate();
}


