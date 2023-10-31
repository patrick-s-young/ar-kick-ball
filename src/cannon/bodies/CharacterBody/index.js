import * as CANNON from 'cannon-es';
import { COLLISION_GROUPS } from '@cannon/collisions';
import { characterMaterial } from '@cannon/materials';


export const CharacterBody = ({
  world
}) => {
  // hard-code size for now...
  const size = {
    x: 0.07,
    y: 0.22,
    z: 0.10
  }
  const { x, y, z } = size;
  const startPosition = [0, y * 0.5, 0];
  const halfExtents = new CANNON.Vec3(x * 0.5, y * 0.5, z * 0.5);
  const body = new CANNON.Body({ 
    mass: 0, 
    shape: new CANNON.Box(halfExtents),
    position: new CANNON.Vec3(...startPosition),
    material: characterMaterial,
    collisionFilterGroup: COLLISION_GROUPS.CHARACTER
  });

  world.addBody(body);

  return {
    get body() { return body }
  }
}
