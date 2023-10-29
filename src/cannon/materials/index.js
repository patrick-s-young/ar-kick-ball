import * as CANNON from 'cannon-es';
export const ballMaterial = new CANNON.Material('ball');
export const floorMaterial = new CANNON.Material('floor');


export const initContactMaterials = ({ world }) => {
// BALL & FLOOR
  const ballAndFloor = new CANNON.ContactMaterial(
    floorMaterial, 
    ballMaterial, {
    friction: 0.1,
    restitution: 0.8
    }
  );
  world.addContactMaterial(ballAndFloor);
}