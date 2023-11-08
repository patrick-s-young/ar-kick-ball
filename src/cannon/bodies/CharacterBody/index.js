import * as CANNON from 'cannon-es';
import { COLLISION_GROUPS } from '@cannon/collisions';
import { characterMaterial } from '@cannon/materials';


export const CharacterBody = ({
  world
}) => {
  // hard-code size for now...
  const size = {
    width: 0.07,
    height: 0.22,
    depth: 0.10
  }

  const startPosition = [0, size.height * 0.5, 0];
  const halfExtents = new CANNON.Vec3(size.width * 0.5, size.height * 0.5, size.depth * 0.5);
  const body = new CANNON.Body({ 
    mass: 0, 
    shape: new CANNON.Box(halfExtents),
    position: new CANNON.Vec3(...startPosition),
    material: characterMaterial,
    collisionFilterGroup: COLLISION_GROUPS.CHARACTER
  });

  world.addBody(body);

  const setPosition = ({ x, y, z }) => {
    body.position.x = x;
    body.position.y = y + size.height * 0.5;
    body.position.z = z;
  }

  return {
    get body() { return body },
    setPosition
  }
}
