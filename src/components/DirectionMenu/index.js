

export const DirectionMenu = ({ 
  menuParent, 
  setDirection,
  setClipAction,
  camera }) => {

  const flexContainer = document.createElement('div');
  flexContainer.style.display = 'flex';
  flexContainer.style.position = 'relative';
  flexContainer.style.marginLeft = '12vw';
  flexContainer.style.marginTop = '6vw';
  flexContainer.style.width = '75vw';
  flexContainer.style.height = '75vw';
  menuParent.appendChild(flexContainer);

  
  //document.addEventListener('touchend', onStop);

  [
    ['spacer', 'BOTTOM', 'spacer'],
    ['LEFT', 'spacer', 'RIGHT'],
    ['spacer', 'TOP', 'spacer']
  ].forEach(item => flexContainer.appendChild(navRow(item)))


  function navRow (items) {
    const flexRow = document.createElement('div');
    items.forEach(item => {
      flexRow.appendChild(navButton({ label: item }))
    });
    return flexRow;
  }
  
  
  function navButton ({ label }) {
    const div = document.createElement('div');
    div.style.display = 'flex';
    div.style.width = '25vw';
    div.style.height = '25vw';
    div.style.borderRadius = '50%';
    div.style.backgroundColor = label === 'spacer' ? undefined : 'orange';
    //div.style.display = 'inline-block';
    div.style.textAlign = 'center';
    div.innerHTML = '&nbsp;';
    div.id = label;
    div.onpointerdown  = label === 'spacer' ? undefined : (ev) => onMove({ ev, label });
    return div;
  }

  function onMove ({ ev, label }) {
    const [x, yNow, z, w] = camera.obj.quaternion.toArray();
    const angle = 2 * Math.acos(w);
    let s;
    if (1 - w * w < 0.000001) {
      s = 1;
    } else {
      s = Math.sqrt(1 - w * w);
    }
    const cameraYradians = yNow/s * angle;
    const yAngle = { 
      TOP: cameraYradians,
      RIGHT: cameraYradians - Math.PI/2,
      BOTTOM: cameraYradians + Math.PI,
      LEFT: cameraYradians + Math.PI/2
    }
    setDirection(yAngle[label] );
    setClipAction('Walk')
  }

  function onStop() {
    setClipAction('Idle');
  }


  return {
    onStop,
    get domElement() { return flexContainer}
  }
}