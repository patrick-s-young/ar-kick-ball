import * as CANNON from 'cannon-es';
import { COLLISION_GROUPS, COLLISION_FILTER_MASKS } from '@cannon/collisions';
import { ballMaterial } from '@cannon/materials';

export const BallBody = ({ world }) => {
  const startPosition = [0, 0.2, 0];
  const radius = .04;
  const body = new CANNON.Body({ 
    mass: .5, 
    shape: new CANNON.Sphere(radius),
    position: new CANNON.Vec3(...startPosition),
    material: ballMaterial,
    collisionFilterGroup: COLLISION_GROUPS.BALL,
    collisionFilterMask: COLLISION_FILTER_MASKS.BALL
  });

  const addToWorld = () => {
    world.addBody(body);
  }

  const setPosition = (positionArr) => {
    body.position.set(...positionArr)
  }

  return {
    get body() { return body },
    get position() { return body.position },
    get quaternion() { return body.quaternion },
    addToWorld,
    setPosition
  }
}