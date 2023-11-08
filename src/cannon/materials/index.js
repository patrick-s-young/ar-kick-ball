import * as CANNON from 'cannon-es';

export const ballMaterial = new CANNON.Material('ball');
export const floorMaterial = new CANNON.Material('floor');
export const characterMaterial = new CANNON.Material('character');


export const initContactMaterials = ({ world }) => {
// BALL & FLOOR
  const ballAndFloor = new CANNON.ContactMaterial(
    floorMaterial, 
    ballMaterial, {
    friction: 0.1,
    restitution: 0.2
    }
  );
  world.addContactMaterial(ballAndFloor);
  // BALL & CHARACTER
  const ballAndCharacter = new CANNON.ContactMaterial(
    characterMaterial, 
    ballMaterial, {
    friction: 0.1,
    restitution: 0.5
    }
  );
  world.addContactMaterial(ballAndCharacter);
}