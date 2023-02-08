

export const DirectionMenu = ({ 
  menuParent, 
  setDirection,
  setClipAction,
  camera }) => {
  const { innerHeight, innerWidth } = window;
  const containerHeight = `${innerWidth}px`;

  const buttonSize = Math.trunc(innerWidth * .25);
  const buttonWidthHeight = `${buttonSize}px`;
  const buttonContainerMarginLeft = `${Math.trunc(buttonSize * .5)}px`;
  const buttonContainerMarginTop = `${innerHeight - buttonSize * 2.9}px`;
  const containerWidth = `${innerWidth - buttonSize}px`;

  const flexContainer = document.createElement('div');
  flexContainer.style.display = 'flex';
  flexContainer.style.position = 'relative';
  flexContainer.style.marginLeft = buttonContainerMarginLeft;
  flexContainer.style.marginTop = buttonContainerMarginTop;
  flexContainer.style.width = containerWidth;
  flexContainer.style.height = containerHeight;
  menuParent.appendChild(flexContainer);


  [
    ['spacer', 'LEFT', 'spacer'],
    ['TOP', 'spacer', 'BOTTOM'],
    ['spacer', 'RIGHT', 'spacer']
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
    div.style.width = buttonWidthHeight;
    div.style.height = buttonWidthHeight;
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

  const enableTouch = () => {
    flexContainer.addEventListener('touchend', onStop)
  }

  return {
    onStop,
    enableTouch,
    get domElement() { return flexContainer}
  }
}