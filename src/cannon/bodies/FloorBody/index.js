import * as CANNON from 'cannon-es';
import { COLLISION_GROUPS } from '@cannon/collisions';
import { floorMaterial } from '@cannon/materials';


export const FloorBody = ({
  world
}) => {
  const startPosition = [0, -.05, 0];
  const startRotationX = -Math.PI / 2;
  const size = { x: 10, y: 10, z: .1};
  const { x, y, z } = size;
  const halfExtents = new CANNON.Vec3(x * 0.5, y * 0.5, z * 0.5);
  const quaternion = new CANNON.Quaternion();
  quaternion.setFromAxisAngle(new CANNON.Vec3(1, 0, 0), startRotationX);
  const boxBody = new CANNON.Body({ 
    mass: 0, 
    shape: new CANNON.Box(halfExtents),
    position: new CANNON.Vec3(...startPosition),
    material: floorMaterial,
    collisionFilterGroup: COLLISION_GROUPS.FLOOR,
    quaternion
  });

  world.addBody(boxBody);

  return {
    get body() { return boxBody }
  }
}