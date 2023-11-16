// cannon
import * as CANNON from 'cannon-es';
import CannonDebugger from 'cannon-es-debugger';
import {
  BoxBody,
  FloorBody,
  initContactMaterials } from '@cannon'; 
// meshes
import {
  FloorShadow,
  Reticle,
  SoccerBall } from '@meshes';
// three
import * as THREE from 'three';
import {
  Camera,
  Character,
  Lights,
  Renderer,
  Scene } from '@three';
// configs
import { SOLDIER } from './configs';
// ui
import {
  ARButton,
  DirectionControls } from '@ui';
// webXR
import {
  HitTestManager,
  XRManager } from '@webXR';
// styles
import './style.css';


//////////////////
// BEGIN COMPONENT
export const App = () => {
  // animation loop
  let meshAnimationUpdate = [];
  const animationClock = new THREE.Clock();

  // three
  const three = {
    scene: Scene(),
    camera: Camera(),
    lights: Lights(),
    renderer: new Renderer()
  }
  three.scene.add(three.lights.getLights());

  // meshes
  const meshes = {
    soldier: Character({
      ...SOLDIER.getMeshConfigs({ isDebugMode: true }), 
      onLoadCallback: initDirectionMenu
    }),
    floorShadow: new FloorShadow(),
    reticle: Reticle(),
  }
  three.scene.add([
    meshes.soldier.mesh,
    meshes.floorShadow.mesh,
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
      setDirection: meshes.soldier.setDirection,
      setClipAction: meshes.soldier.setClipAction,
      camera: three.camera
    }) 
  }


  // XR MANAGER
  const xrManager = XRManager({ startButton: arButton, onReady });
  let hitTestManager;
  let hitTestActive = true;
 


  // XR SESSION READY
  async function onReady () {
    hitTestManager = HitTestManager({ xrSession: xrManager.xrSession });
    xrManager.setOnSelectCallback(onSelectCallback);
    meshAnimationUpdate.push({ name: 'reticle', update: (dt) => meshes.reticle.updateMixer(dt)});
    three.renderer.setReferenceSpaceType( 'local' );
    three.renderer.setSession( xrManager.xrSession  );
    three.renderer.setAnimationLoop(animationLoopCallback);
  }

  // ON SCREEN TAP
  const onSelectCallback = (ev) => {
    if (hitTestActive === false) return;
    if (meshes.reticle.visible) {
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
      // soldier
      meshes.soldier.addBoneBodyAnimation({
        ...SOLDIER.cannonBodies.rightFoot.bone,
        body: BoxBody({ ...SOLDIER.cannonBodies.rightFoot.boxBody, world })
      });
      meshes.soldier.addBoneBodyAnimation({
        ...SOLDIER.cannonBodies.leftFoot.bone,
        body: BoxBody({ ...SOLDIER.cannonBodies.leftFoot.boxBody, world })
      });
      meshes.soldier.setPosition({ x, y, z})
      meshes.soldier.setVisible(true);
      meshAnimationUpdate.push({ name: 'soldier', update: (dt) => meshes.soldier.update(dt) });

      // disable hit test & hide reticle
      hitTestActive = false;
      meshes.reticle.visible = false; 
      // move to UI component
      uiParent.style.visibility = 'visible';
      directionControls?.enableTouch();
      // cannon
      meshAnimationUpdate.push(
      { name: 'cannon', update: (dt) => cannon.world.step(dt)},
      //{ name: 'cannonDebugger', update: () => cannon.debugger.update()}
    );
    }
  }

  // RENDER LOOP
  function animationLoopCallback(timestamp, frame) {
    const dt = animationClock.getDelta();
      let hitPoseTransformMatrix = [];
      if ( frame && hitTestActive === true) {
        if ( hitTestManager.hitTestSourceRequested === false ) hitTestManager.requestHitTestSource();
        hitPoseTransformMatrix = hitTestManager.hitTestSource ? hitTestManager.getHitTestResults(frame) : [];
        if (hitPoseTransformMatrix.length > 0) {
          meshes.reticle.visible = true;
          meshes.reticle.setMatrixFromArray(hitPoseTransformMatrix);
        } else {
          meshes.reticle.visible = false;
        }
      }
    meshes.floorShadow.position = meshes.soldier.position;
    meshAnimationUpdate.forEach(item => item.update(dt));
    three.renderer.render(three.scene.self, three.camera.self);
  }

  return null;
}


