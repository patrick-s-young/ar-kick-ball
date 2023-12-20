import { COLLISION_GROUPS } from '@cannon/collisions';
import { characterMaterial } from '@cannon/materials';


export const SOLDIER_CONFIG = {
  getMeshConfigs: ({ isDebugMode = false }) => ({
    assetPath: '/models/Soldier.glb',
    walkingSpeed: isDebugMode === true ? .015 : .028,
    meshScaler: .125,
    speedScaler: .25,
    defaultClipAction: 'Idle',
    turningIncrement: .075
  }),
  cannonBodies: {
    rightFoot: {
      boxBody: {
        size: {
          width: 0.014,
          height: 0.044,
          depth: 0.02 
        },
        material: characterMaterial,
        collisionFilterGroup: COLLISION_GROUPS.CHARACTER,
        startPosition: [0, 0, 0]
      },
      bone: {
        boneName: 'mixamorigRightFoot',
        bodyOffset: [-0.002, 0.01, 0.003]
      }
    },
    leftFoot: {
      boxBody: {
        size: {
          width: 0.014,
          height: 0.044,
          depth: 0.02 
        },
        material: characterMaterial,
        collisionFilterGroup: COLLISION_GROUPS.CHARACTER,
        startPosition: [0, 0, 0]
      },
      bone: {
        boneName: 'mixamorigLeftFoot',
        bodyOffset: [0.002, 0.01, 0.003]
      }
    }
  }
}

// export const BALL = {