export const SOLDIER_CONFIG = ({ isDebugMode = false }) => ({
  assetPath: '/models/Soldier.glb',
  walkingSpeed: isDebugMode === true ? .015 : .028,
  meshScaler: .125,
  speedScaler: .25,
  defaultClipAction: 'Idle',
  turningIncrement: .05
});