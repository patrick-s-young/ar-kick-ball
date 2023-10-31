
import * as THREE from 'three';

export const Rotation = ({ 
  mesh, 
  turningIncrement,
  defaultRotation }) => {
  let xMagnitude;
  let zMagnitude;
  let yPrev;
  let targetRadians = defaultRotation;
  const yRotateAngle = new THREE.Vector3(0, 1, 0);
  let yRotateQuaternion = new THREE.Quaternion();
  yRotateQuaternion.setFromAxisAngle(yRotateAngle, targetRadians)
  
  function setDirection (radians) {
    targetRadians = radians;
    yRotateQuaternion.setFromAxisAngle(yRotateAngle, targetRadians)
  }

  function update () {
      mesh.quaternion.rotateTowards(yRotateQuaternion, turningIncrement);
      const [x, yNow, z, w] = mesh.quaternion.toArray();
      if (yNow !== yPrev) {
        const angle = 2 * Math.acos(w);
        let s;
        if (1 - w * w < 0.000001) {
          s = 1;
        } else {
          s = Math.sqrt(1 - w * w);
        }
        const yAngle = yNow/s * angle;
        xMagnitude = Math.sin(-yAngle);
        zMagnitude = Math.cos(yAngle);
        yPrev = yNow;
      }
    }
  

  return {
    setDirection,
    update,
    get xMagnitude() { return xMagnitude },
    get zMagnitude() { return zMagnitude },
    get quaternion() { return mesh.quaternion },
    get yAxis() { return yPrev }
  }
}