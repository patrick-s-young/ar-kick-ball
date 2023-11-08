  const { innerHeight, innerWidth } = window;
  const buttonSize = Math.trunc(innerWidth * .25);
  
export const buttonContainerStyles = {
    display: 'flex',
    position: 'relative',
    marginLeft: `${Math.trunc(buttonSize * .5)}px`,
    marginTop: `${innerHeight - buttonSize * 3.0}px`,
    width: `${innerWidth}px`,
    height: `${innerWidth}px`
  }
 export const buttonStyles = {
    display: 'flex',
    width: `${buttonSize}px`,
    height: `${buttonSize}px`,
    borderRadius: '50%',
    textAlign: 'center',
    innerHTML: '&nbsp;'
  }
export const buttonRows = [
    ['spacer', 'LEFT', 'spacer'],
    ['TOP', 'spacer', 'BOTTOM'],
    ['spacer', 'RIGHT', 'spacer']
  ];