import * as CANNON from 'cannon-es';
import { COLLISION_GROUPS, COLLISION_FILTER_MASKS } from '@cannon/collisions';
import { ballMaterial } from '@cannon/materials';

export const BallBody = ({
  world
}) => {
  const startPosition = [.2, .2, 0];
  const radius = .05;
  const body = new CANNON.Body({ 
    mass: .5, 
    shape: new CANNON.Sphere(radius),
    position: new CANNON.Vec3(...startPosition),
    material: ballMaterial,
    collisionFilterGroup: COLLISION_GROUPS.BALL,
    collisionFilterMask: COLLISION_FILTER_MASKS.BALL
  });

  world.addBody(body);

  return {
    get body() { return body }
  }
}