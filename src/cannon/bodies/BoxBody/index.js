import * as CANNON from 'cannon-es';

export const BoxBody = ({
  size,
  material,
  collisionFilterGroup,
  startPosition,
  world
}) => {
  const halfExtents = new CANNON.Vec3(size.width * 0.5, size.height * 0.5, size.depth * 0.5);
  const body = new CANNON.Body({ 
    mass: 0, 
    shape: new CANNON.Box(halfExtents),
    position: new CANNON.Vec3(...startPosition),
    material,
    collisionFilterGroup
  });

  world.addBody(body);

  return body;
}
