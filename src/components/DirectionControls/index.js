

export const DirectionControls = ({ 
  uiParent, 
  setDirection,
  setClipAction,
  camera }) => {
  const { innerHeight, innerWidth } = window;
  const buttonSize = Math.trunc(innerWidth * .25);
  const buttonContainerStyles = {
    display: 'flex',
    position: 'relative',
    marginLeft: `${Math.trunc(buttonSize * .5)}px`,
    marginTop: `${innerHeight - buttonSize * 2.9}px`,
    width: `${innerWidth}px`,
    height: `${innerWidth}px`
  }
  const buttonStyles = {
    display: 'flex',
    width: `${buttonSize}px`,
    height: `${buttonSize}px`,
    borderRadius: '50%',
    textAlign: 'center',
    innerHTML: '&nbsp;'
  }
  const buttonRows = [
    ['spacer', 'LEFT', 'spacer'],
    ['TOP', 'spacer', 'BOTTOM'],
    ['spacer', 'RIGHT', 'spacer']
  ];

// Button container
  const buttonContainer = document.createElement('div');
  Object.entries(buttonContainerStyles).forEach(([key, value]) => buttonContainer.style[key] = value);
  uiParent.appendChild(buttonContainer);

// Button rows
  buttonRows.forEach(items => {
    const rowContainer = document.createElement('div');
    items.forEach(item => rowContainer.appendChild(navButton({ label: item })))
    buttonContainer.appendChild(rowContainer);
  });

// Button
  function navButton ({ label }) {
    const button = document.createElement('div');
    Object.entries(buttonStyles).forEach(([key, value]) => button.style[key] = value);
    button.style.backgroundColor = label === 'spacer' ? undefined : 'orange';
    button.id = label;
    button.onpointerdown  = label === 'spacer' ? undefined : (ev) => onMove({ ev, label });
    return button;
  }

// Calculate up/right/down/left relative to device orientation
  function onMove ({ ev, label }) {
    const [x, y, z, w] = camera.quaternion.toArray();
    const angle = 2 * Math.acos(w);
    let s;
    if (1 - w * w < 0.000001) {
      s = 1;
    } else {
      s = Math.sqrt(1 - w * w);
    }
    const cameraYradians = y/s * angle;
    const yAngle = { 
      TOP: cameraYradians,
      RIGHT: cameraYradians - Math.PI/2,
      BOTTOM: cameraYradians + Math.PI,
      LEFT: cameraYradians + Math.PI/2
    }
    setDirection(yAngle[label] );
    setClipAction('Walk')
  }


  const enableTouch = () => {
    buttonContainer.addEventListener('touchend', () => setClipAction('Idle'))
  }

  return {
    enableTouch,
    get domElement() { return buttonContainer}
  }
}