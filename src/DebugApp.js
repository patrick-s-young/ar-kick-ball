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
  //const scene = new THREE.Scene();
  //const camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 0.01, 20);
  const scene = Scene();
  const camera = Camera();
  const lights = Lights();
  scene.add(lights.getLights());
  // GLTF
  const soldier = Character({...CONFIGS});
  soldier.mesh.visible = true;
  scene.add(soldier.mesh);
  // Geometry
  const floor = new Floor();
  scene.add(floor.mesh);
  const debugFloor = new DebugFloor();
  scene.add(debugFloor.mesh);
  // RENDERER
  const renderer = new DebugRenderer();

  camera.setPosition({ x: 0, y: .4, z: .6 });
  const clock = new THREE.Clock();
  const controls = new OrbitControls( camera.self, renderer.domElement );

  function animate() {
    const dt = clock.getDelta();
    soldier.update(dt);
    requestAnimationFrame( animate );
    controls.update();
    renderer.render( scene.self, camera.self );
  }
  animate();
}


