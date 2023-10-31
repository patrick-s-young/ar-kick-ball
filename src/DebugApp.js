// cannon
import * as CANNON from 'cannon-es';
import CannonDebugger from 'cannon-es-debugger';
import {
  CharacterBody,
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
  // three
  const three = {
    scene: Scene(),
    camera: Camera(),
    lights: Lights(),
    renderer: new DebugRenderer()
  }
  three.camera.setPosition({ x: 0, y: .4, z: .6 });
  three.scene.add(three.lights.getLights());

  // cannon
  const world = new CANNON.World();
  world.gravity.set(0, -10, 0);
  world.broadphase = new CANNON.NaiveBroadphase();
  initContactMaterials({ world });
  const cannon = {
    world,
    floorBody: FloorBody({ world }),
    ballBody: BallBody({ world }),
    debugger: new CannonDebugger(three.scene.self, world)
  }

  // meshes
  const meshes = {
    ball: new Ball(),
    soldier: Character({...SOLDIER_CONFIG({ isDebugMode: true }), onLoadCallback: (mesh) => onSoldierMeshLoaded(mesh)}),
    floor: new Floor(),
    debugFloor: new DebugFloor({})
  }
  meshes.soldier.setVisible(true);
  three.scene.add([
    meshes.ball.mesh,
    meshes.soldier.mesh,
    meshes.floor.mesh,
    meshes.debugFloor.mesh
  ]);
  meshes.debugFloor.setBody(cannon.floorBody.body);
  meshes.ball.setBody(cannon.ballBody.body);

  function onSoldierMeshLoaded (_mesh) {
    // const { min, max } = meshes.soldier.getBoundingBox();
    // const boundingBoxSize = { 
    //   x: max.x - min.x, 
    //   y: max.y - min.y, 
    //   z: max.z - min.z 
    // }
    cannon.characterBody = CharacterBody({ world });
    meshes.soldier.setBody(cannon.characterBody.body);
  }


  // debug 
  const keyEvents = new KeyEvents();
  keyEvents.addTimeOutAction({
    timeoutDuration: 500,
    timeoutCallback: () => meshes.soldier.setClipAction('Idle')
  })
  keyEvents.addSubscriber({ 
    keyName: 'ArrowUp', 
    keyAction: 'keydown', 
    callBack: () => { meshes.soldier.setDirection(0); meshes.soldier.setClipAction('Walk'); }
    });
  keyEvents.addSubscriber({ 
    keyName: 'ArrowRight', 
    keyAction: 'keydown', 
    callBack: () => { meshes.soldier.setDirection(-Math.PI/2); meshes.soldier.setClipAction('Walk'); }
    });
  keyEvents.addSubscriber({ 
    keyName: 'ArrowDown', 
    keyAction: 'keydown', 
    callBack: () => { meshes.soldier.setDirection(Math.PI); meshes.soldier.setClipAction('Walk'); }
    });
  keyEvents.addSubscriber({ 
    keyName: 'ArrowLeft', 
    keyAction: 'keydown', 
    callBack: () => { meshes.soldier.setDirection(Math.PI/2); meshes.soldier.setClipAction('Walk'); }
    });
  const controls = new OrbitControls( three.camera.self, three.renderer.domElement );

  // animation loop
  const animationClock = new THREE.Clock();
  function animate() {
    const dt = animationClock.getDelta();
    meshes.soldier.update(dt);
    meshes.ball.update();
    cannon.world.step(dt);
    cannon.debugger.update();
    requestAnimationFrame( animate );
    controls.update();
    three.renderer.render( three.scene.self, three.camera.self );
  }
  animate();
}


