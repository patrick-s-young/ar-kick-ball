import * as CANNON from 'cannon-es';

export const BoxBody = ({
  mass = 0,
  size,
  material,
  collisionFilterGroup,
  collisionFilterMask,
  startPosition,
  world
}) => {
  const halfExtents = new CANNON.Vec3(size.width * 0.5, size.height * 0.5, size.depth * 0.5);
  const body = new CANNON.Body({ 
    mass, 
    shape: new CANNON.Box(halfExtents),
    position: new CANNON.Vec3(...startPosition),
    material,
    collisionFilterGroup,
    collisionFilterMask
  });

  world.addBody(body);

  return body;
}
