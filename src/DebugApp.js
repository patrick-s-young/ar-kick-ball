// cannon
import * as CANNON from 'cannon-es';
import CannonDebugger from 'cannon-es-debugger';
import {
  BallBody,
  FloorBody,
  initContactMaterials } from '@cannon'; 
// debug
import {
  DebugFloor,
  DebugRenderer,
  KeyEvents } from '@debug';
// meshes
import {
  Ball,
  Floor,
  SOLDIER_CONFIG } from '@meshes';
// three
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import {
  Camera,
  Character,
  Lights,
  Scene } from '@three';
// styles
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
  const soldier = Character({...SOLDIER_CONFIG({ isDebugMode: true })});
  soldier.mesh.visible = true;
  scene.add(soldier.mesh);
  const animationClock = new THREE.Clock();
  // Geometry
  const floor = new Floor();
  scene.add(floor.mesh);
  const debugFloor = new DebugFloor({});
  scene.add(debugFloor.mesh);
  // Cannon
  const world = new CANNON.World();
  world.gravity.set(0, -30, 0);
  world.broadphase = new CANNON.NaiveBroadphase();
  initContactMaterials({ world })
  const floorBody = FloorBody({ world });
  debugFloor.setBody(floorBody.body);
  const ball = new Ball();
  scene.add(ball.mesh);
  const ballBody = BallBody({ world });
  ball.setBody(ballBody.body);
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
  const cannonDebugger = new CannonDebugger(scene.self, world);

  function animate() {
    const dt = animationClock.getDelta();
    soldier.update(dt);
    ball.update();
    world.step(dt);
    cannonDebugger.update();
    requestAnimationFrame( animate );
    controls.update();
    renderer.render( scene.self, camera.self );
  }
  animate();
}


