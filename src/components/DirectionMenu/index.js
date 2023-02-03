

export const DirectionMenu = ({ 
  menuParent, 
  setDirection,
  camera }) => {

  const flexContainer = document.createElement('div');
  flexContainer.style.display = 'inline';
  flexContainer.style.position = 'absolute';
  flexContainer.style.width = '100vw';
  flexContainer.style.marginTop = '70vh';
  flexContainer.style.justifyContent = 'center';
  menuParent.appendChild(flexContainer);

  


  [
    'spacer', 'TOP', 'spacer',
    'LEFT', 'spacer', 'RIGHT',
    'spacer', 'BOTTOM', 'spacer'].forEach(item => flexContainer.appendChild(navButton({ label: item })))
  
  
  function navButton ({ label }) {
    const div = document.createElement('div');
    div.style.width = '33%';
    div.style.height = '16vw';
    div.style.backgroundColor = label === 'spacer' ? undefined : 'orange';
    div.style.display = 'inline-block';
    div.style.textAlign = 'center';
    div.innerHTML = label === 'spacer' ? '&nbsp;' : label;
    div.onclick = label === 'spacer' ? undefined : () => onClick({ label });
    return div;
  }

  function onClick ({ label }) {
    const [x, yNow, z, w] = camera.obj.quaternion.toArray();

    // if (yNow !== yPrev) {
       const angle = 2 * Math.acos(w);
       let s;
       if (1 - w * w < 0.000001) {
         s = 1;
       } else {
         s = Math.sqrt(1 - w * w);
       }
       //const result = { axis: new THREE.Vector3(x/s, yNow/s, z/s), angle }
       const cameraYradians = yNow/s * angle;
       const yAngle = { 
          TOP: cameraYradians,
          RIGHT: cameraYradians - Math.PI/2,
          BOTTOM: cameraYradians + Math.PI,
          LEFT: cameraYradians + Math.PI/2
       }

       console.log('new Direction', yAngle[label] )
    setDirection(yAngle[label] );
  }


  return {
    
  }
}