import * as THREE from 'three';

export function Animation() {
  // ANIMATION
  let animationMixer;
  let previousAction;
  let activeAction;
  const clipActionsMap = new Map();


  const init = (gltf) => {
    animationMixer = new THREE.AnimationMixer(gltf.scene);
    gltf.animations.filter(ac => ac.name !== 'TPose').forEach(ac => clipActionsMap.set(ac.name, animationMixer.clipAction(ac)));
  }

  const playClipAction = (clipActionName) => {
    previousAction = activeAction;
    activeAction = clipActionsMap.get(clipActionName);
    // TRANSITION TO NEW CLIP ACTION
    if (previousAction === activeAction) return;
    if (previousAction !== undefined ) previousAction.fadeOut(.5);
    activeAction
      .reset()
      .setEffectiveTimeScale(1)
      .setEffectiveWeight(1)
      .fadeIn(.5)
      .play();
  }

  const update = (deltaSeconds) => animationMixer?.update(deltaSeconds);

  return {
    init,
    update,
    playClipAction,
    clipActionsMap
  }
}
