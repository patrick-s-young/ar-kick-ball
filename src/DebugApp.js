// cannon
import * as CANNON from 'cannon-es';
import CannonDebugger from 'cannon-es-debugger';
import {
  CharacterBody,
  FootBody,
  FloorBody,
  initContactMaterials } from '@cannon'; 
// debug
import {
  DebugFloor,
  DebugRenderer,
  initKeyEvents } from '@debug';
// meshes
import {
  FloorShadow,
  Reticle,
  SoccerBall,
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
//////////////////
// BEGIN COMPONENT
export const DebugApp = () => {
  // animation loop
  let meshAnimationUpdate = [];
  const animationClock = new THREE.Clock();

  // three
  const three = {
    scene: Scene(),
    camera: Camera(),
    lights: Lights(),
    renderer: new DebugRenderer()
  }
  three.camera.setPosition({ x: 0, y: .4, z: .6 });
  three.scene.add(three.lights.getLights());
  three.controls = new OrbitControls( three.camera.self, three.renderer.domElement );

  // meshes
  const meshes = {
    soldier: Character({...SOLDIER_CONFIG({ isDebugMode: true }), onLoadCallback: (mesh) => onSoldierMeshLoaded(mesh)}),
    floorShadow: new FloorShadow(),
    reticle: Reticle(),
    debugFloor: new DebugFloor({})
  }
  three.scene.add([
    meshes.soldier.mesh,
    meshes.floorShadow.mesh,
    meshes.debugFloor.mesh,
    meshes.reticle.mesh
  ]);

  // cannon
  const world = new CANNON.World();
  world.gravity.set(0, -10, 0);
  world.broadphase = new CANNON.NaiveBroadphase();
  initContactMaterials({ world });
  const cannon = {
    world,
    floorBody: FloorBody({ world }),
    debugger: new CannonDebugger(three.scene.self, world)
  }

  // hit test emulator
  const hitTest = {
    raycaster: new THREE.Raycaster(),
    pointer: new THREE.Vector2()
  }


  // start reticle hitTest 
  function onSoldierMeshLoaded (_mesh) {
    meshes.reticle.visible = true;
    meshAnimationUpdate.push(
      { name: 'reticle', update: (dt) => meshes.reticle.updateMixer(dt)},
      { name: 'orbitControls', update: () => three.controls.update()}
    );
    three.renderer.domElement.addEventListener('pointermove', onPointerMove);
    three.renderer.domElement.addEventListener('click', onClick);

    //console.log('rightFootBone:', meshes.soldier.rightFootBone);
   // const boneWorldPos = new THREE.Vector3()
  //  meshes.soldier.rightFootBone.getWorldPosition(boneWorldPos);
   // console.log('rightFootBone worldPosition:', boneWorldPos)

  }


  // reticle hitTest emulator frame loop
  function onPointerMove(event) { 
    hitTest.pointer.x = ( event.clientX / window.innerWidth ) * 2 - 1; 
    hitTest.pointer.y = - ( event.clientY / window.innerHeight ) * 2 + 1; 
    hitTest.raycaster.setFromCamera( hitTest.pointer, three.camera.self );
    const intersects = hitTest.raycaster.intersectObject(meshes.debugFloor.mesh); 
    if (intersects.length > 0) meshes.reticle.setPosition(intersects[0].point);
  }

  // reticle hitTest selection emulator
  const onClick = () => {
    three.renderer.domElement.removeEventListener('pointermove', onPointerMove);
    three.renderer.domElement.removeEventListener('click', onClick);
    // reticle
    const { x, y, z } = new THREE.Vector3().setFromMatrixPosition(meshes.reticle.mesh.matrix);
    meshes.reticle.visible = false;
    meshAnimationUpdate = meshAnimationUpdate.filter(item => item.name === 'reticle');
    // soccer ball
    meshes.soccerBall = SoccerBall({ 
      assetPath: '/models/soccer_ball.glb',
      onLoadCallback: () => {},
      scene: three.scene,
      world: cannon.world
    });
    meshes.soccerBall.setPosition([x + .2 , y + .3, z]);
    meshAnimationUpdate.push({ name: 'soccerBall', update: (dt) => meshes.soccerBall.update(dt)});
    // floorBody
    cannon.floorBody.setPosition([x, y -.05, z]);
    cannon.floorBody.addToWorld();
    // floorShadow
    meshes.floorShadow.setPosition({ x, y, z});
    meshes.floorShadow.visible = true;
    // floor emulation
    meshes.debugFloor.setPosition({ x, y: y - 0.01, z});
    // soldier
    cannon.rightFootBody = FootBody({ world });
    cannon.leftFootBody = FootBody({ world });
    meshes.soldier.addBoneBodyAnimation({
      boneName: 'mixamorigRightFoot',
      body: cannon.rightFootBody.body,
      bodyOffset: [-0.002, 0.01, 0.003]
    });
    meshes.soldier.addBoneBodyAnimation({
      boneName: 'mixamorigLeftFoot',
      body: cannon.leftFootBody.body,
      bodyOffset: [0.002, 0.01, 0.003]
    });
    meshes.soldier.setPosition({ x, y, z})
    meshes.soldier.setVisible(true);
    meshAnimationUpdate.push({ name: 'soldier', update: (dt) => meshes.soldier.update(dt) });
    // Arrow keys controls
    initKeyEvents({ mesh: meshes.soldier});
    // cannon
    meshAnimationUpdate.push(
      { name: 'cannon', update: (dt) => cannon.world.step(dt)},
      { name: 'cannonDebugger', update: () => cannon.debugger.update()}
    );
  }

  
  // animation loop
  function animate() {
    const dt = animationClock.getDelta();
    meshAnimationUpdate.forEach(item => item.update(dt));
    meshes.floorShadow.position = meshes.soldier.position;
    three.renderer.render( three.scene.self, three.camera.self );
    requestAnimationFrame( animate );
  }
  animate();
}


